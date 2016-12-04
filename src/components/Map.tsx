import * as React from "react";
import { Message } from "./Application";
import haversine from "../haversine";
import mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import { render, unmountComponentAtNode } from "react-dom";

mapboxgl.accessToken = "pk.eyJ1IjoiYWxleGFuZGVyZWtkYWhsIiwiYSI6ImNpdW1uenBjbzAwMGsyemw4NjBpaDhrdXMifQ.2tN8BK3jrFZS80KyFWqyHw";

const css = require<string>("mapbox-gl/dist/mapbox-gl.css");
const head = (document.head || document.getElementsByTagName("head")[0]);
const styleElement = document.createElement("style");
styleElement.innerHTML = css;
head.appendChild(styleElement);

interface MapProps {
  latitude: number;
  longitude: number;
  messages: Message[];
  messageView: (messageId: number) => void;
}

interface MapState {
  latitude: number;
  longitude: number;
}

function createGeoJSONCirclePolygon(longitude, latitude, km: number, points = 64): mapboxgl.GeoJSONSourceRaw {
  let ret: [number, number][] = [];
  let distanceX = km / (111.320 * Math.cos(latitude * Math.PI / 180));
  let distanceY = km / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);

    ret.push([longitude + x, latitude + y]);
  }
  ret.push(ret[0]);

  const feature: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [ret],
    }
  };

  return {
    type: "geojson",
    data: feature
  };
};

export default class MapComponent extends React.Component<MapProps, MapState> {
  mapContainer: HTMLDivElement;
  map: mapboxgl.Map;

  constructor(props) {
    super();
    this.state = {
      latitude: props.latitude,
      longitude: props.longitude,
    };
  }

  createGeoJSONMessages(): mapboxgl.GeoJSONSourceRaw {
    const features = this.props.messages.map((message): GeoJSON.Feature<GeoJSON.Point> => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [message.longitude, message.latitude]
        },
        properties: {
          id: message.id,
          title: message.content,
          distance: haversine(this.state.latitude, this.state.longitude, message.latitude, message.longitude)
        }
      };
    });

    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features
      },
      cluster: true,
      clusterMaxZoom: 13,
      clusterRadius: 25,
    };
  }

  renderMessages() {
    const sourceId = "messages";

    this.map.addSource(sourceId, this.createGeoJSONMessages());

    // Nearby messages
    this.map.addLayer({
      id: "messages-nearby-label",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": "{title}",
        "text-size": 11,
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-anchor": "bottom",
        "text-offset": [0, -0.8],
      } as mapboxgl.SymbolLayout,
      filter: ["<", "distance", 100],
    });
    this.map.addLayer({
      id: "messages-nearby-border",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": "#00D600",
        "circle-radius": 9,
      },
      filter: ["<", "distance", 100],
    });
    this.map.addLayer({
      id: "messages-nearby",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": "#00FF00",
        "circle-radius": 8,
      },
      filter: ["<", "distance", 100],
    });

    // Distant messages
    this.map.addLayer({
      id: "messages-unclustered-border",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": "#D60000",
        "circle-radius": 6,
      },
      filter: ["all", ["!has", "point_count"], [">=", "distance", 100]],
    });
    this.map.addLayer({
      id: "messages-unclustered",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": "#F00",
        "circle-radius": 5,
      },
      filter: ["all", ["!has", "point_count"], [">=", "distance", 100]],
    });
    this.map.addLayer({
      id: "messages-clustered-border",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": "#D60000",
        "circle-radius": 17,
      },
      filter: [">=", "point_count", 0],
    });
    this.map.addLayer({
      id: "messages-clustered",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": "#F00",
        "circle-radius": 16,
      },
      filter: [">=", "point_count", 0],
    });
    this.map.addLayer({
      id: "messages-count",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": "{point_count}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-size": 16
      } as mapboxgl.SymbolLayout,
      paint: {
        "text-color": "#fff",
      }
    });
  }

  onMapClick(e) {
    let features = this.map.queryRenderedFeatures(e.point, { layers: ["messages-nearby"] });

    if (!features.length) {
      return;
    }

    let feature = features[0];
    const el = document.createElement("div");
    render(<span onClick={() => { this.props.messageView(feature.properties.id); } }>
      {feature.properties.title}
    </span>, el);

    let popup = new mapboxgl.Popup({ closeButton: false })
      .setLngLat(feature.geometry.coordinates)
      .setDOMContent(el)
      .on("close", () => { unmountComponentAtNode(el); })
      .addTo(this.map);
  }

  onMapLoad() {
    this.map.addSource("circle", createGeoJSONCirclePolygon(this.state.longitude, this.state.latitude, 0.1));
    this.map.addLayer({
      id: "circle",
      type: "fill",
      source: "circle",
      layout: {},
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.15
      }
    });

    this.renderMessages();

    this.map.on("click", this.onMapClick.bind(this));
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v10",
      center: [this.state.longitude, this.state.latitude],
      zoom: 16
    });

    this.map.on("load", this.onMapLoad.bind(this));
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div ref={(div) => { this.mapContainer = div; } }></div>;
  }
}

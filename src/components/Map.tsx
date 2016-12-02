import * as React from "react";
import { Message } from "./Application";
import haversine from "../haversine";
import mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = "pk.eyJ1IjoiYWxleGFuZGVyZWtkYWhsIiwiYSI6ImNpdW1uenBjbzAwMGsyemw4NjBpaDhrdXMifQ.2tN8BK3jrFZS80KyFWqyHw";

const css = require<string>("mapbox-gl/dist/mapbox-gl.css");
const head = (document.head || document.getElementsByTagName("head")[0]);
const styleElement = document.createElement('style');
styleElement.innerHTML = css;
head.appendChild(styleElement);

interface MapProps {
    latitude: number;
    longitude: number;
    messages: Message[];
    messageView: (message: Message) => void;
}

interface MapState {
    latitude: number;
    longitude: number;
}

function createGeoJSONCircle(longitude, latitude, radiusInKm: number, points = 64): mapboxgl.GeoJSONSourceRaw {
    let km = radiusInKm;

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
    }

    return {
        type: "geojson",
        data: feature
    }
};

function createGeoJSONCircles(messages: Message[]): mapboxgl.GeoJSONSourceRaw {
    const features = messages.map((message): GeoJSON.Feature<GeoJSON.Point> => {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [message.longitude, message.latitude]
            },
            properties: {}
        };
    });

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: features
        }
    }
}

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

    onMapLoad() {
        this.map.addSource('circle', createGeoJSONCircle(this.state.longitude, this.state.latitude, 0.1));
        this.map.addLayer({
            id: 'circle',
            type: 'fill',
            source: 'circle',
            layout: {},
            paint: {
                'fill-color': '#088',
                'fill-opacity': 0.15
            }
        });

        this.map.addSource('circles', createGeoJSONCircles(this.props.messages));
        this.map.addLayer({
            id: 'circles',
            type: 'circle',
            source: 'circles',
            paint: {
                'circle-color': "#F00",
            }
        });

        for (var i = 0; i < this.props.messages.length; i++) {
            const message = this.props.messages[i];
            if (haversine(this.state.latitude, this.state.longitude, message.latitude, message.longitude) < 100) {
                var el = document.createElement('div');
                el.innerText = message.content;
                el.addEventListener("click", () => { this.props.messageView(message); })

                var popup = new mapboxgl.Popup({closeOnClick: false, closeButton: false})
                    .setLngLat([message.longitude, message.latitude])
                    .setDOMContent(el)
                    .addTo(this.map);
            }
        }
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer, // container id
            style: 'mapbox://styles/mapbox/streets-v10', //stylesheet location
            center: [this.state.longitude, this.state.latitude], // starting position
            zoom: 16 // starting zoom
        });

        this.map.on('load', this.onMapLoad.bind(this));
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        return <div ref={(div) => { this.mapContainer = div; } }></div>
        // const visiblePopups = this.props.messages.map((message, i) => {
        //     if (haversine(this.state.latitude, this.state.longitude, message.latitude, message.longitude) < 100) {
        //         return (
        //             <Popup key={i} coordinates={[message.longitude, message.latitude]}>
        //                 <div onClick={() => { this.props.messageView(message); } }>
        //                     {message.content}
        //                 </div>
        //             </Popup>
        //         );
        //     }
        // });

        // {visiblePopups}
        // <GeoJSONLayer
        //     data={createGeoJSONCircle(this.state.longitude, this.state.latitude, 0.1)}
        //     symbolLayout={{
        //         "visibility": "none",
        //     }}
        //     fillPaint={{
        //         "fill-color": "blue",
        //         "fill-opacity": 0.3
        //     }} />
        // <GeoJSONLayer data={createGeoJSONCircles(this.props.messages)} />
        // return (
        //     <ReactMapboxGl
        //         style="mapbox://styles/mapbox/streets-v10"
        //         accessToken="pk.eyJ1IjoiYWxleGFuZGVyZWtkYWhsIiwiYSI6ImNpdW1uenBjbzAwMGsyemw4NjBpaDhrdXMifQ.2tN8BK3jrFZS80KyFWqyHw"
        //         center={[this.state.longitude, this.state.latitude]}
        //         zoom={[16]}>
        //     </ReactMapboxGl>
        // );
    }
}

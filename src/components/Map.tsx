import * as React from "react";
import ReactMapboxGl, { Popup, Feature, GeoJSONLayer } from "react-mapbox-gl";
import { Message } from "./App";
import haversine from "../haversine";

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

function createGeoJSONCircle(longitude, latitude, radiusInKm: number, points = 64) {
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

    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [ret]
        }
    };
};

function createGeoJSONCircles(messages: Message[]) {
    const features = messages.map((message) => {
        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [message.longitude, message.latitude]
            },
            "properties": {}
        };
    });

    return {
        "type": "FeatureCollection",
        "features": features,
    };
}

export default class Map extends React.Component<MapProps, MapState> {
    constructor(props) {
        super();
        this.state = {
            latitude: props.latitude,
            longitude: props.longitude,
        };
    }

    render() {
        const visiblePopups = this.props.messages.map((message, i) => {
            if (haversine(this.state.latitude, this.state.longitude, message.latitude, message.longitude) < 100) {
                return (
                    <Popup key={i} coordinates={[message.longitude, message.latitude]}>
                        <div onClick={() => { this.props.messageView(message); } }>
                            {message.content}
                        </div>
                    </Popup>
                );
            }
        });

        return (
            <ReactMapboxGl
                style="mapbox://styles/mapbox/streets-v10"
                accessToken="pk.eyJ1IjoiYWxleGFuZGVyZWtkYWhsIiwiYSI6ImNpdW1uenBjbzAwMGsyemw4NjBpaDhrdXMifQ.2tN8BK3jrFZS80KyFWqyHw"
                center={[this.state.longitude, this.state.latitude]}
                zoom={[16]}>
                {visiblePopups}
                <GeoJSONLayer
                    data={createGeoJSONCircle(this.state.longitude, this.state.latitude, 0.1)}
                    symbolLayout={{
                        "visibility": "none",
                    }}
                    fillPaint={{
                        "fill-color": "blue",
                        "fill-opacity": 0.3
                    }} />
                <GeoJSONLayer data={createGeoJSONCircles(this.props.messages)} />
            </ReactMapboxGl>
        );
    }
}

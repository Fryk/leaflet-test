import React, { useState } from 'react';
import styles from './App.module.scss';

import L, { IconOptions, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

interface CustomMarker {
    x: number;
    y: number;
    label: string;
    id: number;
    visited: boolean;
}

L.Marker.prototype.options.icon = DefaultIcon;

const visitedIcon = new L.Icon({
    iconUrl: require('./open-gift-box.png'),
    iconSize: new L.Point(64, 64),
    class: 'leaflet-div-icon'
} as IconOptions);

const notVisitedIcon = new L.Icon({
    iconUrl: require('./gift-box.png'),
    iconSize: new L.Point(60, 75),
    class: 'leaflet-div-icon'
} as IconOptions);

const center = [51.505, -0.09]
const zoom = 13

function App() {
    const [customMarkers, setCustomMarkers] = useState([]);
    const [map, setMap] = useState(null);

    function addRandomMarker(event) {
        const markers: CustomMarker[] = [...customMarkers];
        const id = Math.round(Math.random() * 999);
        const newMarker = {
            x: 51.505 + Math.random() * 0.1 - 0.5,
            y: -0.09 + (Math.random() * 0.05),
            label: `Marker ${id}`,
            id,
            visited: false
        }
        markers.push(newMarker);
        centerMap(newMarker)
        setCustomMarkers(markers);
    }

    function centerMap(marker: CustomMarker) {
        if (!map) {
            return;
        }
        const latlng: LatLngExpression = {
            lat: marker.x,
            lng: marker.y
        };

        if (!marker.visited) {
            const markers = [...customMarkers];
            markers.filter(m => m.id === marker.id).forEach(m => m.visited = true);
            setCustomMarkers(markers);
        }

        map.setView(latlng);
    }

    return (
        <div>
            <div>
                <h1 className={styles.header}>Santracking</h1>
            </div>
            <div>
                <ul className={styles.inlineList}>
                    <li onClick={addRandomMarker}>Add random marker</li>
                </ul>
            </div>
            <div>
                <ul className={styles.inlineList}>
                    {
                        customMarkers.map((marker) => (
                            <li key={marker.id} onClick={() => centerMap(marker)}>{marker.label}{marker.visited ? ' (visited)' : ''}</li>
                        ))
                    }
                </ul>
            </div>
            <div>
                <MapContainer center={{lat: center[0], lng: center[1]}} zoom={zoom} scrollWheelZoom={false}
                              style={{height: '500px'}} whenCreated={setMap}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        customMarkers.map((marker) => (
                            <Marker position={[marker.x, marker.y]} key={marker.id}
                                    icon={marker.visited ? visitedIcon : notVisitedIcon}>
                                <Popup>
                                    Popup number {marker.label}
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            </div>
        </div>
    );
}

export default App;

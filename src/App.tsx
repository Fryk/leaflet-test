import React, { useState } from 'react';
import styles from './App.module.scss';

import * as salesman from 'salesman.js'

import L, { IconOptions, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { CustomMarker } from './Model/CustomMarker';

import Menu from './Menu/Menu'
import LocationList from './LocationList/LocationList';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

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

const limeOptions = {
    color: 'lime',
    weight: 5
}

const center = [51.4, 19.7]
const zoom = 13

function App() {
    const [customMarkers, setCustomMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [showPath, setShowPath] = useState(false);
    const [path, setPath] = useState([]);

    const calculateRoute = () => {
        setShowPath(true);
        const points = customMarkers
            .filter(m => !m.visited)
            .map(marker => ({
                label: marker.label,
                point: new salesman.Point(marker.x, marker.y)
            }));
        const solution = salesman.solve(points.map(p => p.point));
        const orderedPoints = solution.map(i => points[i].label);
        setPath(solution.map(i => points[i]).map(p => [p.point.x, p.point.y]));
    };

    function addRandomMarker(event) {
        setShowPath(false);
        const markers: CustomMarker[] = [...customMarkers];
        const id = Math.round(Math.random() * 99999);
        const newMarker = {
            x: center[0] + (Math.random() * 6 - 3),
            y: center[1] + (Math.random() * 8 - 4),
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
            setShowPath(false);
        }

        map.setView(latlng);
    }

    return (
        <div>
            <div>
                <h1 className={styles.header}>Santracking</h1>
            </div>
            <Menu onAddRandomMarker={addRandomMarker} onCalculateRoute={calculateRoute}/>
            <LocationList markers={customMarkers} onCenterMap={centerMap}/>
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
                    {
                        showPath ? (<Polyline pathOptions={limeOptions} positions={path}/>) : null
                    }
                </MapContainer>
            </div>

        </div>
    );
}

export default App;

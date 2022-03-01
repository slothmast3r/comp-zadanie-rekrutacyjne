// @ts-nocheck
import React, { useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import jsonData from "../client/test-data.json";
import VehicleImage from "./VehicleImage";
const fetcher = (...args) => fetch(...args).then(response => response.json());

// RENDER PROPS / HOC
const Marker = ({ children }) => children;

export default function App() {
    const mapRef = useRef();
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(10);
    const dataString = JSON.stringify(jsonData);
    const data = JSON.parse(dataString);

    const points = data.objects.map(item => ({
        type: "Feature",
        properties: { cluster: false, crimeId: item.id },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(item.location.longitude),
                parseFloat(item.location.latitude)
            ]
        }
    }));

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 75, maxZoom: 20 }
    });

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCHUtrOWFcrWUyqhtUH_OnPB0cBv0HGdhU" }}
                defaultCenter={{ lat: 63, lng: 71.135171 }}
                defaultZoom={10}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map }) => {
                    mapRef.current = map;
                }}
                onChange={({ zoom, bounds }) => {
                    setZoom(zoom);
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat
                    ]);
                }}
            >
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const {
                        cluster: isCluster,
                        point_count: pointCount
                    } = cluster.properties;

                    if (isCluster) {
                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                lat={latitude}
                                lng={longitude}
                            >
                                <div
                                    className="cluster-marker"
                                    style={{
                                        width: `${10 + (pointCount / points.length) * 20}px`,
                                        height: `${10 + (pointCount / points.length) * 20}px`,
                                        color: 'white',
                                        cursor: 'pointer',
                                        background: 'black'
                                    }}
                                    onClick={() => {
                                        const expansionZoom = Math.min(
                                            supercluster.getClusterExpansionZoom(cluster.id),
                                            20
                                        );
                                        mapRef.current.setZoom(expansionZoom);
                                        mapRef.current.panTo({ lat: latitude, lng: longitude });
                                    }}
                                >
                                    {pointCount}
                                </div>
                            </Marker>
                        );
                    }

                    return (
                        <Marker
                            key={`crime-${cluster.properties.crimeId}`}
                            lat={latitude}
                            lng={longitude}
                        >
                            <VehicleImage/>
                        </Marker>
                    );
                })}
            </GoogleMapReact>
        </div>
    );
}
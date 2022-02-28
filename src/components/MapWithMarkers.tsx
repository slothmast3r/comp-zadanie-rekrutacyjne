import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { useFetch } from "../client/useFetch";
import { Marker } from "./Marker";
import {ApiTypes} from "../client/api-types";

const warsawCoordinate = { lat: 52.24732278524699, lng: 21.011729601193167 };

const compUrl = "https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE";

const MapWithMarkers = () => {
    const [center, setCenter] = useState(warsawCoordinate);
    const [zoom, setZoom] = useState(11);
    const { data, loading, error } = useFetch(compUrl);

    return (
        <div style={{ height: "70vh", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyArEQx-mWZgg2UH8zYNjU5g3R0e7iyH0_I" }}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                {data &&
                    data.objects.map((item: ApiTypes) => {
                        return (
                            <Marker
                                // @ts-ignore
                                lat={item.location.latitude}
                                lng={item.location.longitude}
                                text="My Marker"
                            />
                        );
                    })}
            </GoogleMapReact>
        </div>
    );
};
export default MapWithMarkers
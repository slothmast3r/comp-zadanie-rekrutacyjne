// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import jsonData from "../client/test-data.json";
import VehicleImage from "./VehicleImage";
import "./MapWithMarkers.scss";
import Dropdown from "./Dropdown";
import { useFetch } from "../client/useFetch";
import { ApiTypes, Type } from "../client/api-types";
import MultiRangeSlider from "./MultiRangeSlider";

// RENDER PROPS / HOC
const Marker = ({ children }) => children;

export default function App() {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const dataString = JSON.stringify(jsonData);
  const data = JSON.parse(dataString);
  const [vehicles, setVehicles] = useState(data.objects);

  const [dropdownVehicleStatus, setDropdownVehicleStatus] = useState<
    string | null
  >(null);
  const [batteryRange, setBatteryRange] = useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 100 });

  // const {data, loading, error} = useFetch('https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE')
  const availabilityDropdown = [
    { label: "Available", id: "available" },
    { label: "Unavailable", id: "unavailable" },
  ];

  const points = vehicles.map((item) => ({
    type: "Feature",
    properties: { cluster: false, ...item },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(item.location.longitude),
        parseFloat(item.location.latitude),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });
  function updateDropdownKey(key: string | number | null) {
    setDropdownVehicleStatus(key);
  }
  function updateBatteryRange(argument) {
    let argumentcopy = {...argument}
    setBatteryRange(argumentcopy);
  }

  useEffect(() => {
    setVehicles(
      data.objects
        .filter(
          (element: Type) =>
            element.status === dropdownVehicleStatus ||
            dropdownVehicleStatus === null
        )
        .filter(
          (element: Type) =>
            element.batteryLevelPct >= batteryRange.min &&
            element.batteryLevelPct <= batteryRange.max
        )
    );
  }, [dropdownVehicleStatus, batteryRange]);

  return (
    <div className={"map-wrapper"}>
      <div className={"header-filters"}>
        <Dropdown
          data={availabilityDropdown}
          onChange={updateDropdownKey}
          placeHolder={"Select availability"}
        />
        <MultiRangeSlider
          min={0}
          title={"Battery life"}
          max={100}
          onChange={updateBatteryRange}
        />
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
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
            bounds.nw.lat,
          ]);
        }}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;
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
              key={`vehicle-${cluster.properties.id}`}
              lat={latitude}
              lng={longitude}
            >
              <VehicleImage color={cluster.properties.colour} />
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

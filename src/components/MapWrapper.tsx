import React, {useEffect} from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from "axios";
import useFetch from "react-fetch-hook";

const containerStyle = {
    width: '400px',
    height: '400px'
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyArEQx-mWZgg2UH8zYNjU5g3R0e7iyH0_I"
    })

    const url = 'https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE'

    const [data, setData] = React.useState<any>([])
    const [map, setMap] = React.useState(null)
    const [center, setCenter] = React.useState<any>({
        lat: -3.745,
        lng: -38.523
    })


    const fetchData = ()=>{
        axios(url)
            .then((response)=> {
                setData(response.data)
                if(data.length){
                    setCenter({lat: data[0].location.latitude, lng: data[0].location.longitude})
                }
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    // React.useEffect(function (){
    // },[])

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        fetchData()
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */ }
            <></>
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)
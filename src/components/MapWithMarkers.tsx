import React, {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import axios from "axios";


const MapWithMarkers = (props: any) => {
    const [center, setCenter] = useState({lat: 11.0168, lng: 76.9558 });
    const [zoom, setZoom] = useState(11);
    const [data, setData] = useState<any>([])

    const compUrl = 'https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE'
    const fetchData = async ()=>{
        const response = await axios(compUrl)
        setData(response.data.objects)
        if(data.length)
            setCenter({lat: data[0].location.latitude, lng: data[0].location.longitude})

    }
    useEffect(()=>{
       fetchData()
    },[])

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyArEQx-mWZgg2UH8zYNjU5g3R0e7iyH0_I' }}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                {data.map((car: { location: {latitude: number, longitude: number} }, index: number)=>{
                return <Marker key={index}
                    lat={car.location.latitude}
                    lng={car.location.longitude}
                    />
            })}
            </GoogleMapReact>
        </div>
    );
}

export default MapWithMarkers;
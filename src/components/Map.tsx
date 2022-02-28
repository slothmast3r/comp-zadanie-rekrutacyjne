import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';


const SimpleMap = (props: any) => {
    const [center, setCenter] = useState({lat: 11.0168, lng: 76.9558 });
    const [zoom, setZoom] = useState(11);
    return (
        <div style={{ height: '600px', width: '600px' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyArEQx-mWZgg2UH8zYNjU5g3R0e7iyH0_I' }}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                <Marker
                    lat={11.0168}
                    lng={76.9558}
                    name="My Marker"
                    color="blue"
                />
            </GoogleMapReact>
        </div>
    );
}

export default SimpleMap;
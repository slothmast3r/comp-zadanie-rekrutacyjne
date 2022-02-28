import React from 'react';
import './Marker.scss';

interface MarkerProps {
    color: string,
    name: string,
    id?: string
}

export const Marker : React.FC<MarkerProps> = (props) => {
    const { color, name, id } = props;
    return (
        <div className="marker"
             style={{ backgroundColor: color, cursor: 'pointer'}}
        >
            {name}
        </div>
    );
};
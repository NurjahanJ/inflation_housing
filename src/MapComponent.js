// src/MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Center the map to a default location, e.g., New York City.
const center = {
  lat: 40.7128,
  lng: -74.0060
};

function MapComponent() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {/* Example marker */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;

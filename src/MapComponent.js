// src/MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.0902, // Approximate center of the US
  lng: -95.7129
};

// Define marker data for each city
const cities = [
  {
    name: "Los Angeles, CA",
    position: { lat: 34.0522, lng: -118.2437 },
    highlight: true, // This city is highlighted as having the highest increase
  },
  {
    name: "San Diego, CA",
    position: { lat: 32.7157, lng: -117.1611 },
    highlight: false,
  },
  {
    name: "San Francisco, CA",
    position: { lat: 37.7749, lng: -122.4194 },
    highlight: false,
  },
  {
    name: "Seattle, WA",
    position: { lat: 47.6062, lng: -122.3321 },
    highlight: false,
  },
  {
    name: "Phoenix, AZ",
    position: { lat: 33.4484, lng: -112.0740 },
    highlight: false,
  },
];

function MapComponent() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Ensure this is stored in .env and not committed

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        {cities.map((city, index) => (
          <Marker
            key={index}
            position={city.position}
            label={{
              text: city.name,
              color: "black",
              fontSize: city.highlight ? "14px" : "12px",
              fontWeight: city.highlight ? "bold" : "normal",
              fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
            }}
            icon={city.highlight ? {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            } : undefined}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MapComponent);

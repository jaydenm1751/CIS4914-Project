import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = ({ lat, lng }) => {
  const mapStyles = {
    height: '100vh',
    width: '100%'
  };

  const defaultCenter = {
    lat: lat || 40.7128, // Default latitude (New York City as an example)
    lng: lng || -74.0060 // Default longitude
  };

  return (
    <LoadScript googleMapsApiKey={'AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls'}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;

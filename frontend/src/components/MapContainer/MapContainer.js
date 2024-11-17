import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

const MapContainer = ({ lat, lng }) => {
  //Google Maps context
  const { isLoaded, geocoder } = useGoogleMaps();

  const mapStyles = {
    height: '100vh',
    width: '100%'
  };

  const defaultCenter = {
    lat: lat || 40.7128, // Default latitude (New York City as an example)
    lng: lng || -74.0060 // Default longitude
  };

  return !isLoaded ? <p>Loading...</p> : (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={defaultCenter}
    >
      <Marker position={defaultCenter} />
    </GoogleMap>
  );
};

export default MapContainer;

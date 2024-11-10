// src/MapSection/MapSection.js
import React, { useEffect, useState } from 'react';
import MapContainer from '../MapContainer/MapContainer'; // Assuming MapContainer is in this folder

const MapSection = () => {
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error retrieving location:", error);
          setUserLocation({
            lat: 29.64991, // Default fallback location (you can adjust)
            lng: -82.34866,
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation({
        lat: 29.64991,
        lng: -82.34866,
      });
    }
  }, []);

  return (
    <div className="map-container">
      {/* Left column: Map */}
      <div className="map-container">
         {/* Display the map with user's current location */}
         <div className="map-box">
          {userLocation.lat && userLocation.lng ? (
            <MapContainer lat={userLocation.lat} lng={userLocation.lng} />
          ) : (
            <p>Loading your current location...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSection;

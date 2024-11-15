// GoogleMapsContext.js
import React, { createContext, useContext } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls",
    libraries: ["places"],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

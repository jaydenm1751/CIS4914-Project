import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls",
    libraries: ["places"],
  });

  const [geocoder, setGeocoder] = useState(null);

    useEffect(() => {
    if (isLoaded && window.google && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, geocoder]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || !geocoder) return <div>Loading Maps</div>;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, geocoder }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

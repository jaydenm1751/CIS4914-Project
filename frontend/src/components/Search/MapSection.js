import React, { useEffect, useState } from 'react';
import './Search.css'; 
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; 
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

const MapSection = ({ mapCenter, searchResults }) => {
  const navigate = useNavigate();
  const { isLoaded } = useGoogleMaps();

  const [subleases, setSubleases] = useState([]);

  useEffect(() => {
    const fetchSubleases = async () => {
        try {
          if (searchResults && searchResults.length > 0) {
            const updatedSubleases = await Promise.all(
              searchResults.map(async (sublease) => {
                if (!sublease.address.lat || !sublease.address.lng) {
                  await geocodeAddress(sublease.address, sublease);
                }
                return sublease;
              })
            );
    
            setSubleases(updatedSubleases);
          } else {
            setSubleases([]);
          }
        } catch (error) {
          console.error('Error fetching subleases:', error);
        }
    };

    fetchSubleases();
  }, [searchResults]); 

  const geocodeAddress = async (address, sublease) => {
    const geocoder = new window.google.maps.Geocoder();
    const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zip}`;
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          sublease.address.lat = lat;
          sublease.address.lng = lng;
          resolve();
        } else {
          reject(`Geocode failed for address: ${fullAddress}, status: ${status}`);
        }
      });
    });
  };

  const handleMarkerClick = (subleaseId) => {
    console.log('Marker clicked with ID:', subleaseId);
    if (subleaseId) {
      navigate(`/sublease/${subleaseId}`);
    } else {
      console.warn('No sublease ID found for this marker');
    }
  };

  const mapStyle = [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }] // Hide business points of interest
    },
    {
      featureType: "poi.attraction",
      stylers: [{ visibility: "on" }] // Keep other POIs visible
    },
    {
      featureType: "poi.park",
      stylers: [{ visibility: "on" }] // Keep parks visible
    },
  ];

  return !isLoaded ? <p>Loading...</p> : (
    <div className="search-page">
      <div className="map-container">
        <div className="map-box">
          {mapCenter && mapCenter.lat && mapCenter.lng ? (
            <GoogleMap
              id="sublease-map"
              mapContainerStyle={{
                width: '100%',
                height: '100%', 
              }}
              zoom={12}
              center={mapCenter}
              options={{
                styles: mapStyle,
                gestureHandling: "greedy",
              }}
            >
              {subleases.map((sublease, index) => {
                if (!sublease.address.lat || !sublease.address.lng) {
                  console.warn(`Missing lat/lng for sublease ${index}:`, sublease);
                  return null; 
                }

                return (
                  <Marker
                    key={index}
                    position={{
                      lat: sublease.address.lat,
                      lng: sublease.address.lng,
                    }}
                    title={sublease.title}
                    onClick={() => handleMarkerClick(sublease.id)} // Ensure the correct ID is passed
                  />
                );
              })}
            </GoogleMap>
          ) : (
            <p>Loading your current location...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSection;

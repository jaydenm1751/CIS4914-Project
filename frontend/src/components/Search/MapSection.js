import React, { useEffect, useState } from 'react';
import './Search.css'; 
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; 

const GOOGLE_API_KEY = 'AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls'; 

const MapSection = ({ searchResults }) => {
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [subleases, setSubleases] = useState([]);
  const navigate = useNavigate(); 

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
            lat: 29.64991,
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

  useEffect(() => {
    const fetchSubleases = async () => {
        try {
          console.log("searchResults in useEffect:", searchResults); // Debugging line
          
          // Use the searchResults if they exist
          if (searchResults && searchResults.length > 0) {
            console.log('Using search results for subleases');
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
            console.log('No search results, fetching all subleases');
            const querySnapshot = await getDocs(collection(db, 'subleases'));
            const subleasesData = querySnapshot.docs.map((doc) => {
              return { 
                id: doc.id, 
                ...doc.data() // Spread the rest of the document data
              };
            });
            console.log("Fetched Subleases Data:", subleasesData);

            // Geocode each sublease address to lat/lng if not already present
            const updatedSubleases = await Promise.all(
              subleasesData.map(async (sublease) => {
                if (!sublease.address.lat || !sublease.address.lng) {
                  await geocodeAddress(sublease.address, sublease);
                }
                return sublease;
              })
            );
    
            setSubleases(updatedSubleases);
          }
        } catch (error) {
          console.error('Error fetching subleases:', error);
        }
    };

    fetchSubleases();
  }, [searchResults]); // Run again if searchResults changes

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

  return (
    <div className="search-page">
      <div className="map-container">
        <div className="map-box">
          {userLocation.lat && userLocation.lng ? (
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
              <GoogleMap
                id="sublease-map"
                mapContainerStyle={{
                  width: '100%',
                  height: '100%', 
                }}
                zoom={12}
                center={userLocation}
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
            </LoadScript>
          ) : (
            <p>Loading your current location...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSection;

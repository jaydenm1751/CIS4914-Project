import React, { useEffect, useState } from 'react';
import './Search.css'; 
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; 

const GOOGLE_API_KEY = 'AIzaSyDnSV7ev8TKKTTzC8moLgAFBLF94dZ13Ls'; 

const Search = () => {
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
      } catch (error) {
        console.error('Error fetching subleases:', error);
      }
    };

    fetchSubleases();
  }, []);

  // Geocode the address to lat/lng using the Google Maps Geocoding API
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

  // Handle Marker Click - Navigate to sublease page with ID
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
      {/* Left column: Map */}
      <div className="map-container">
        <div className="map-box">
          {userLocation.lat && userLocation.lng ? (
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
              <GoogleMap
                id="sublease-map"
                mapContainerStyle={{
                  width: '100%',
                  height: '100%', // Ensure map fills the container
                }}
                zoom={12}
                center={userLocation}
              >
                {/* Render all pins on the map */}
                {subleases.map((sublease, index) => {
                  if (!sublease.address.lat || !sublease.address.lng) {
                    console.warn(`Missing lat/lng for sublease ${index}:`, sublease);
                    return null; // Skip rendering if lat/lng are missing
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

      {/* Right column: Search box */}
      <div className="search-parameters-container">
        <h2>Search Subleases</h2>
        <form className="search-form">
          {/* Location Input */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" placeholder="Enter city or neighborhood" />
          </div>

          {/* Price Range Input */}
          <div className="form-group">
            <label htmlFor="price-range">Price Range</label>
            <input type="text" id="price-range" placeholder="Min - Max" />
          </div>

          {/* Number of Rooms Input */}
          <div className="form-group">
            <label htmlFor="rooms">Number of Rooms</label>
            <input type="number" id="rooms" placeholder="1, 2, 3+" />
          </div>

          {/* Search Button */}
          <button type="submit" className="search-button">Search</button>
        </form>

        <div className="additional-parameters">
          <p>Additional search parameters to be added accordingly.</p>
        </div>
      </div>
    </div>
  );
};

export default Search;

import React, { useEffect, useState } from 'react';
import './Search.css'; 
import MapContainer from '../MapContainer/MapContainer';

const Search = () => {
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  // Use the Geolocation API to get the user's current location
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
          // we should show a default location if retrieval is disallowed...
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
  }, []); // Run this once when the component is mounted

  return (
    <div className="search-page">
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

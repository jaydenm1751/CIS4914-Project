import React from 'react';
import './Search.css'; 

const Search = () => {
  return (
    <div className="search-page">
      {/* Left column: Map */}
      <div className="map-container">
        {/* Placeholder for map component */}
        <div className="map-box">
          <h2></h2>
          {/*Future map API here*/}
          <p>Google Maps will go here</p>
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

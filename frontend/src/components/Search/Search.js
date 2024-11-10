import React, { useState } from 'react';
import AddressSearchToolbar from './SearchBar';
import MapSection from './MapSection';
import ResultsSection from './ResultSection';

function App() {
  const [results, setResults] = useState([]);
  const [mapView, setMapView] = useState(true);

  // Function to handle search input from AddressSearchToolbar
  const handleSearch = (searchResults) => {
    setResults(searchResults);
  };

  const toggleViewChange = (viewState) => {
    setMapView(viewState);
  }

  return (
    <div>
      <AddressSearchToolbar onSearch={handleSearch} onViewChange={toggleViewChange} />
      <div style={{ display: 'flex', width: '100%' }}>
        {mapView && 
          <div style={{ flex: 1 }}>
            <MapSection results={results} />
          </div>
        }
        <div style={{ flex: 1, padding: '0px' }}>
          <ResultsSection results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;

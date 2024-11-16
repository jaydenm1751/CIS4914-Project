import React, { useState } from 'react';
import SearchToolbar from './SearchBar';
import MapSection from './MapSection';
import ResultsSection from './ResultSection';

function App() {
  const [searchQuery, setSearchQuery] = useState[''];
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minRooms: '' });
  const [view, setView] = useState('map');
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSearch = (searchResults) => {
    setResults(searchResults);
  };

  const toggleViewChange = (newView) => {
    setView(newView);
  }

  return (
    <div>
      <SearchToolbar onSearch={handleSearch} onViewChange={toggleViewChange} />
      <div style={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
        {view === 'map' && 
          <div style={{ flex: 1 }}>
            <MapSection searchResults={results} />
          </div>
        }
        <div style={{ flex: 1, padding: '0px' }}>
          <ResultsSection searchResults={results} />
        </div>
      </div>
    </div>
  );
}

export default App;

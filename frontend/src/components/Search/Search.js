import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';
import MapListToggle from './MapListToggle';
import MapSection from './MapSection';
import ResultSection from './ResultSection';

import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { AppBar, Toolbar, Box, Divider } from '@mui/material';
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

const firestore = getFirestore();

function Search() {
  //Google Maps context
  const { isLoaded, geocoder } = useGoogleMaps();
  
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minRooms: '' });
  const [view, setView] = useState('map');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 29.64991, lng: -82.34866 });
  const [results, setResults] = useState([]);

  //Get the user's location or default to the stadium
  useEffect(() => {
    if (isLoaded) {      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            reverseGeocode(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error retrieving location:", error);
            setDefaultLocation();
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setDefaultLocation();
      }
    }
  }, [isLoaded]);

  // Function to reverse geocode a location using lat and lng
  const reverseGeocode = (lat, lng) => {
    if (isLoaded && window.google) {  // Check if google is available on window
      const latLng = new window.google.maps.LatLng(lat, lng);  // Use window.google here
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            setSelectedLocation(results[0]);
          }
        } else {
          console.log('Geocoder failed due to:', status);
        }
      });
    } else {
      console.error("Google Maps API not loaded yet or geocoder is not available");
    }
  };

  // Set default location
  const setDefaultLocation = () => {
    const defaultLat = 29.64991;
    const defaultLng = -82.34866;
    mapCenter = { defaultLat, defaultLng };
    reverseGeocode(defaultLat, defaultLng); 
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  }

  const toggleViewChange = (newView) => {
    setView(newView);
  }

  const handleSearch = (searchLocation) => {
    setSelectedLocation(searchLocation);
    setMapCenter({ lat: searchLocation.geometry.location.lat(), lng: searchLocation.geometry.location.lng()});
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchSubleases();
    }
  }, [selectedLocation, filters]);

  const fetchSubleases = async () => {
    const addressComponents = selectedLocation.address_components;
    let street = '';
    let city = '';
    let state = '';
    let zip = '';
    
    addressComponents.forEach((component) => {
      if (component.types.includes('street_address')) {
        street = component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        zip = component.long_name;
      }
    });

    try {
      const subleasesRef = collection(firestore, "subleases");

      let q = query(subleasesRef);

      //Search based on address
      if (street && street.trim() !== '') {
        q = query(q, where("address.street", "==", street));
      }
      if (city && city.trim() !== '') {
        q = query(q, where("address.city", "==", city));
      }
      if (state && state.trim() !== '') {
        q = query(q, where("address.state", "==", state));
      }
      // if (zip && zip.trim() !== '') {
      //   q = query(q, where("address.zip", "==", zip));
      // }

      //Apply the filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {  
          switch (key) {
            case 'minPrice':
              q = query(q, where("rent", ">=", Number(value)));
              break;
            case 'maxPrice':
              q = query(q, where("rent", "<=", Number(value)));
              break;
            case 'minRooms':
              q = query(q, where("numBedrooms", ">=", Number(value)));
              break;
            default:
              break;
          }
        }
      });

      // Execute the query
      const querySnapshot = await getDocs(q);
      const fetchedSubleases = [];
      
      querySnapshot.forEach((doc) => {
        fetchedSubleases.push({ id: doc.id, ...doc.data() });
      });

      setResults(fetchedSubleases);
    } catch (error) {
      console.error("Error fetching subleases: ", error);
    }
  };

  return (
    <div>
      <AppBar position="static" color="white" sx={{ padding: '0px', boxShadow: 'none' }}>
        <Toolbar sx={{ height: '50px', display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side: Search Input and Filtesr */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchBar onSearch={handleSearch}/>
            <FilterOptions onApplyFilters={handleApplyFilters}/>
          </Box>

          {/* Right side: Map/List Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MapListToggle onViewChange={toggleViewChange}/>
          </Box>
        </Toolbar>

        <Divider sx={{ marginTop: '8px', borderColor: 'black' }} />
      </ AppBar>

      <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>
        {view === 'map' && 
          <div style={{ flex: 1 }}>
            <MapSection mapCenter={mapCenter} searchResults={results} />
          </div>
        }
        <div style={{ flex: 1, padding: '0px' }}>
          <ResultSection searchResults={results} viewMode={view} />
        </div>
      </div>
    </div>
  );
}

export default Search;

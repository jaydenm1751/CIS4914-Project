import React, { useState, useRef } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

function SearchBar({ onSearch }) {
  //Google Maps context
  const { isLoaded, geocoder } = useGoogleMaps();

  //Address Search Query
  const [query, setQuery] = useState('');

  //Address
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zip, setZip] = useState('');

  const handleSearch = () => {
    if (isLoaded && geocoder && address) {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const bestMatch = results[0];
          setAddress(bestMatch.formatted_address);

          onSearch(bestMatch);
        } 
      });
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  const autocompleteRef = useRef(null);
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      const addressComponents = place.address_components;

      let tempStreet = '';
      let tempCity = '';
      let tempState = '';
      let tempZip = '';

      addressComponents.forEach((component) => {
        const types = component.types;

        if (types.includes('street_number') || types.includes('route')) {
          tempStreet += component.long_name + ' ';
        }
        if (types.includes('locality')) {
          tempCity = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          tempState = component.long_name;
        }
        if (types.includes('postal_code')) {
          tempZip = component.long_name;
        }
      })

      tempStreet = street.trim();

      setAddress(place.formatted_address);
      setStreet(tempStreet);
      setCity(tempCity);
      setState(tempState);
      setZip(tempZip);
    }
  };

  return !isLoaded ?<p>Loading...</p> : (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <TextField
            hiddenLabel
            placeholder="Address, neighborhood, city"
            variant="outlined"
            size="small"
            value={address}
            onKeyPress={handleKeyPress} 
            onChange={(event) => setAddress(event.target.value)}
            sx={{
              marginRight: '10px',
              width: '500px',
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': { color: 'black', borderColor: '#333' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
            }}
          />
      </Autocomplete>
      <IconButton onClick={handleSearch} color="primary" aria-label="search" sx={{ marginRight: '20px', color: 'black' }}>
        <SearchIcon sx={{ color: 'black' }} />
      </IconButton>
    </Box>
  );
}

export default SearchBar;

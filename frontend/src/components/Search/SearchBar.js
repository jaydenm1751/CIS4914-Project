import React, { useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { AppBar, Toolbar, TextField, IconButton, Box, Popover, Button, InputAdornment, Typography, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const firestore = getFirestore();

function SearchBar({ onSearch, onViewChange }) {
  const [address, setAddress] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomAnchorEl, setRoomAnchorEl] = useState(null);
  const [minPrice, setMinPrice] = useState(0);  // Default minPrice to 0
  const [maxPrice, setMaxPrice] = useState(100000);  // Default maxPrice to Infinity
  const [minRooms, setMinRooms] = useState(0);
  const [view, setView] = useState('map');

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePriceRangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRoomNumberClick = (event) => {
    setRoomAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setRoomAnchorEl(null);
  };

  const handleMinPriceChange = (event) => {
    const min = parseFloat(event.target.value);

    if (minPrice && isNaN(min)) {
      setMinPrice(0); 
    } else {
      setMinPrice(min);
    }
  }

  const handleMaxPriceChange = (event) => {
    const max = parseFloat(event.target.value);

    if (minPrice && isNaN(max)) {
      setMaxPrice(100000); 
    } else {
      setMaxPrice(max);
    }
  }

  const handleMinRoomsChange = (event) => {
    const min = parseFloat(event.target.value);

    if (minPrice && isNaN(min)) {
      setMinRooms(0); 
    } else {
      setMinRooms(min);
    }
  }

  const fetchSubleases = async () => {
    try {
      const subleasesRef = collection(firestore, "subleases");
      // console.log("minPrice:", minPrice, "Type:", typeof minPrice);
      // console.log("maxPrice:", maxPrice, "Type:", typeof maxPrice);
      // console.log("minRooms:", minRooms, "Type:", typeof minRooms);
      
      const q = query(
        subleasesRef,
        where("rent", ">=", Number(minPrice)),
        where("rent", "<=", Number(maxPrice)),
        where("numBedrooms", ">=", Number(minRooms))
      );

      // Execute the query
      const querySnapshot = await getDocs(q);
      const fetchedSubleases = [];
      
      querySnapshot.forEach((doc) => {
        fetchedSubleases.push({ id: doc.id, ...doc.data() });
      });

      onSearch(fetchedSubleases);
    } catch (error) {
      console.error("Error fetching subleases: ", error);
    }
  };

  const handleSearch = () => {
    fetchSubleases();
    handlePopoverClose(); // Close the popovers after search
  };

  const openPrice = Boolean(anchorEl);
  const openRoom = Boolean(roomAnchorEl);
  const idPrice = openPrice ? 'price-popover' : undefined;
  const idRoom = openRoom ? 'room-popover' : undefined;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView); 
      onViewChange(newView === 'map');
    }
  };

  return (
    <AppBar position="static" color="white" sx={{ padding: '0px', boxShadow: 'none' }}>
      <Toolbar sx={{ height: '50px', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: Search Input and Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            hiddenLabel
            placeholder="Address, neighborhood, city, ZIP"
            variant="outlined"
            size="small"
            value={query}
            onChange={handleInputChange}
            sx={{
              marginRight: '10px',
              width: '500px',
              '& .MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                color: 'black',
                borderColor: '#333',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#333',
              },
            }}
          />
          <IconButton onClick={handleSearch} color="primary" aria-label="search" sx={{ marginRight: '20px', color: 'black' }}>
            <SearchIcon sx={{ color: 'black' }} />
          </IconButton>

          {/* Price Range Button */}
          <Button
            onClick={handlePriceRangeClick}
            variant="outlined"
            size="large"
            endIcon={openPrice ? <ArrowDropUpIcon sx={{ color: 'black' }} /> : <ArrowDropDownIcon sx={{ color: 'black' }} />}
            sx={{ marginRight: '20px', borderColor: 'black', color: 'black' }}
          >
            Price
          </Button>

          {/* Room Number Dropdown Button */}
          <Button
            onClick={handleRoomNumberClick}
            variant="outlined"
            size="large"
            endIcon={openRoom ? <ArrowDropUpIcon sx={{ color: 'black' }} /> : <ArrowDropDownIcon sx={{ color: 'black' }} />}
            sx={{ marginRight: '20px', borderColor: 'black', color: 'black' }}
          >
            Rooms
          </Button>
        </Box>

        {/* Right side: Map/List Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ToggleButton value="map" sx={{ color: view === 'map' ? 'primary.main' : 'black' }}>
              Map
            </ToggleButton>
            <ToggleButton value="list" sx={{ color: view === 'list' ? 'primary.main' : 'black' }}>
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Toolbar>

      {/* Divider Line */}
      <Divider sx={{ marginTop: '8px', borderColor: 'black' }} />

      {/* Price Range Popover */}
      <Popover
        id={idPrice}
        open={openPrice}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          width: '1000px',
          padding: '20px',
          maxWidth: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '20px', gap: '20px', color: 'black' }}>
          <Typography variant='subtitle1'>Price Range</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <TextField
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'black',
                },
                '& .MuiOutlinedInput-root': {
                  color: 'black',
                  borderColor: '#333',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#333',
                },
              }}
            />
            <TextField
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'black',
                },
                '& .MuiOutlinedInput-root': {
                  color: 'black',
                  borderColor: '#333',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#333',
                },
              }}
            />
          </Box>

          <Button onClick={handleSearch} variant="contained" color="primary" fullWidth>
            Apply
          </Button>
        </Box>
      </Popover>

      {/* Room Number Popover */}
      <Popover
        id={idRoom}
        open={openRoom}
        anchorEl={roomAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          width: '1000px',
          padding: '20px',
          maxWidth: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '20px', gap: '20px', color: 'black' }}>
          <Typography variant='subtitle1'>Bedrooms</Typography>

          <TextField
            label="Min Rooms"
            type="number"
            value={minRooms}
            onChange={handleMinRoomsChange}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                color: 'black',
                borderColor: '#333',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#333',
              },
            }}
          />

          <Button onClick={handleSearch} variant="contained" color="primary" fullWidth>
            Apply
          </Button>
        </Box>
      </Popover>
    </AppBar>
  );
}

export default SearchBar;
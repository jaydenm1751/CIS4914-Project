import React, { useState } from 'react';
import { TextField, Box, Popover, Button, InputAdornment, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function FilterOptions({ onApplyFilters }) {
  //Search Filters
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomAnchorEl, setRoomAnchorEl] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRooms, setMinRooms] = useState(0);

  const handlePriceRangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRoomNumberClick = (event) => {
    setRoomAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    validateFilters();

    setAnchorEl(null);
    setRoomAnchorEl(null);
  }
  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  }
  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  }
  const handleMinRoomsChange = (event) => {
    setMinRooms(event.target.value);
  }

  const validateFilters = () => {    
    const min = parseFloat(minPrice);
    if (minPrice && !isNaN(min)) {
      setMinPrice(Number(min));
    } else {
      setMinPrice(Number(0));
    }

    const max = parseFloat(maxPrice);
    if (maxPrice && !isNaN(max)) {
      setMaxPrice(Number(max));
    } else {
      setMaxPrice(Number(100000));
    }

    const rooms = parseFloat(minRooms);
    if (minRooms && !isNaN(rooms)) {
      setMinRooms(Number(rooms));
    } else {
      setMinRooms(Number(0));
    }
  }

  const handleApply = () => {
    validateFilters();

    onApplyFilters({
      minPrice, 
      maxPrice, 
      minRooms
    })

    handlePopoverClose(); 
  };

  const openPrice = Boolean(anchorEl);
  const openRoom = Boolean(roomAnchorEl);
  const idPrice = openPrice ? 'price-popover' : undefined;
  const idRoom = openRoom ? 'room-popover' : undefined;

  return (
    <Box>
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

          <Button onClick={handleApply} variant="contained" color="primary" fullWidth>
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

          <Button onClick={handleApply} variant="contained" color="primary" fullWidth>
            Apply
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default FilterOptions;

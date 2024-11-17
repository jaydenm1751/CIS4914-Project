import React, { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

function MapListToggle({ onViewChange }) {
  const [view, setView] = useState('map');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
      onViewChange(newView);
    }
  };

  return (
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
  );
}

export default MapListToggle;

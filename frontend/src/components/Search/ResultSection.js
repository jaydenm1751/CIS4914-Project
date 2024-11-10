import React from 'react';
import SubleaseCard from './SubleaseCard'; // Ensure the path is correct for your project structure
import { Grid, Typography } from '@mui/material';

const ResultSection = ({ searchResults }) => {
  return (
    <div style={{ position: 'relative', height: '750px', overflowY: 'auto' }}> {/* Add relative positioning to this container */}
      {searchResults.length === 0 ? (
        <div 
          style={{
            position: 'absolute',  // Absolute positioning within the parent container
            top: '20px',           // 10px from the top
            left: '20px',          // 10px from the left
            textAlign: 'center',
            zIndex: 1,             // Ensure it's on top of other content
          }}
        >
          <Typography>No results found...</Typography>
        </div>
      ) : (
        <Grid container spacing={0.5} justifyContent="center">
          {searchResults.map((listing) => (
            <Grid item key={listing.id}>
              <SubleaseCard
                images={listing.imageUrls}    
                price={listing.rent}        
                rooms={listing.numBedrooms}     
                bathrooms={listing.numBathrooms} 
                sqft={listing.sqft}           
                address={listing.address}  
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ResultSection;

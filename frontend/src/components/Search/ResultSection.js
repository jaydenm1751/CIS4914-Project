import React from 'react';
import SubleaseCard from './SubleaseCard'; 
import { Grid, Typography } from '@mui/material';

const ResultSection = ({ searchResults, viewMode }) => {
  const columnSize = viewMode === 'map' ? 6 : 3;

  return (
    <div style={{ position: 'relative', height: '100vh', overflowY: 'auto' }}> 
      {searchResults.length === 0 ? (
        <div 
          style={{
            position: 'absolute',
            top: '20px',           
            left: '20px',
            textAlign: 'center',
          }}
        >
          <Typography>No results found...</Typography>
        </div>
      ) : (
        <Grid container spacing={0} justifyContent="center">
          {searchResults.map((listing) => (
            <Grid 
              item 
              xs={12} 
              md={columnSize} 
              key={listing.id} 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <SubleaseCard
                subleaseId={listing.id}
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

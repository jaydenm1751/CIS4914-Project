import React from 'react';
import SubleaseCard from './SubleaseCard'; // Ensure the path is correct for your project structure
import { Grid } from '@mui/material';

const ResultSection = ({ results }) => {
  return (
    <div>
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div style={{ height: '750px', overflowY: 'auto' }}> {/* Set a fixed height and enable scrolling */}
          <Grid container spacing={0.5} justifyContent="center">
            {results.map((listing) => (
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
        </div>
      )}
    </div>
  );
};

export default ResultSection;

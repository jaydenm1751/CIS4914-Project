import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Box, Card, Typography, Grid, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; // For previous/next arrows
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function SubleaseCard({ images, price, rooms, bathrooms, sqft, address }) {
  const sliderRef = useRef(null); // Create a reference to the Slider component

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // Disable adaptive height for consistency
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // Move to next slide
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev(); // Move to previous slide
    }
  };

  // Destructure the address map
  const { city, state, street, zip } = address;

  // Format the full address
  const fullAddress = `${street}, ${city}, ${state} ${zip}`;

  return (
    <Card sx={{ width: 300, height: 250, margin: 1, padding: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ height: 200, marginBottom: 0, overflow: 'hidden', position: 'relative' }}> 
        {/* Fixed height for image container */}
        <Slider ref={sliderRef} {...settings}>
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Listing Image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          ))}
        </Slider>
        {/* Previous and Next Buttons */}
        <IconButton 
          onClick={handlePrev} 
          sx={{ position: 'absolute', top: '50%', left: '0px', transform: 'translateY(-50%)', zIndex: 1 }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton 
          onClick={handleNext} 
          sx={{ position: 'absolute', top: '50%', right: '0px', transform: 'translateY(-50%)', zIndex: 1 }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textAlign: 'left', marginTop: 0, marginBottom: 0 }}>
        ${price}/mo
      </Typography>
      <Typography variant="body1">{rooms} bds  |  {bathrooms} ba  |  {sqft} sqft</Typography>
      {/* <Grid container justifyContent="left" spacing={1} sx={{ marginTop: 0}}>
        <Grid item>
          <Typography variant="body1">{rooms} bds | </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{bathrooms} ba | </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{sqft} sqft</Typography>
        </Grid>
      </Grid> */}
      <Typography variant="body2" color="textPrimary" textAlign="left">
        {fullAddress}
      </Typography>
    </Card>
  );
}

export default SubleaseCard;

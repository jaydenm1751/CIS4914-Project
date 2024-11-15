import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Box, Card, Typography, Grid, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function SubleaseCard({ images, price, rooms, bathrooms, sqft, address }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, 
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); 
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev(); 
    }
  };

  const { city, state, street, zip } = address;
  const fullAddress = `${street}, ${city}, ${state} ${zip}`;

  return (
    <Card sx={{ width: 400, height: 270, margin: 1, padding: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ height: 200, marginBottom: 0, overflow: 'hidden', position: 'relative' }}> 
        <Slider ref={sliderRef} {...settings}>
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Listing Image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          ))}
        </Slider>
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
      <Typography variant="body2" color="textPrimary" textAlign="left">
        {fullAddress}
      </Typography>
    </Card>
  );
}

export default SubleaseCard;

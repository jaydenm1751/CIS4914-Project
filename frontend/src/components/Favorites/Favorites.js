import React from 'react';
import './Favorites.css'; 
import SubleasePost from '../Home/SubleasePost'; 

const Favorites = () => {
  const favoriteListings = [
    {
      id: 1,
      title: '2 Bedroom Apartment in Downtown',
      rent: '$1200/month',
      description: 'A spacious 2 bedroom apartment with all amenities included.',
      location: 'Downtown, City Name',
    },
    {
      id: 2,
      title: 'Studio Apartment Near University',
      rent: '$800/month',
      description: 'Cozy studio apartment, perfect for students, near campus.',
      location: 'University Area, City Name',
    },
  
  ];

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">Favorited Sublease Postings</h1>
      <div className="post-list">
        {favoriteListings.map((listing) => (
          <SubleasePost
            key={listing.id}
            title={listing.title}
            rent={listing.rent}
            description={listing.description}
            location={listing.location}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;

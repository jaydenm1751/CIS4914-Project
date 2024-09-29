import React from 'react';
import './Home.css';
import SubleasePost from './SubleasePost';

const Home = () => {
  const subleasePosts = [
    {
      id: 1,
      address: {
        street: '123 Main St',
        city: 'City Name',
        state: 'State Name',
        zip: '12345',
      },
      rent: '$1200/month',
      imageUrl: 'https://via.placeholder.com/150', // Example image URL
    },
    {
      id: 2,
      address: {
        street: '456 University Ave',
        city: 'City Name',
        state: 'State Name',
        zip: '67890',
      },
      rent: '$800/month',
      imageUrl: 'https://via.placeholder.com/150', // Example image URL
    },
    // Add more sublease posts as needed
  ];

  return (
    <div className="home-container">
      {/* Sublease Posts */}
      <div className="post-list">
        {subleasePosts.map((post) => (
          <SubleasePost
            key={post.id}
            address={post.address}
            rent={post.rent}
            imageUrl={post.imageUrl} // Pass the image URL to SubleasePost
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

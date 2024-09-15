import React from 'react';
import './Home.css';
import NavBar from './NavBar';
import SubleasePost from './SubleasePost';

const Home = () => {
  const subleasePosts = [
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
    // Add more sublease posts as needed
  ];

  return (
    <div className="home-container">
      {/* Navbar */}
      <NavBar />

      {/* Sublease Posts */}
      <div className="post-list">
        {subleasePosts.map((post) => (
          <SubleasePost
            key={post.id}
            title={post.title}
            rent={post.rent}
            description={post.description}
            location={post.location}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

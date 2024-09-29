import React, { useState, useEffect }  from 'react';
import './Home.css';
import {collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SubleasePost from './SubleasePost';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // const subleasePosts = [
  //   {
  //     id: 1,
  //     title: '2 Bedroom Apartment in Downtown',
  //     rent: '$1200/month',
  //     description: 'A spacious 2 bedroom apartment with all amenities included.',
  //     location: 'Downtown, City Name',
  //   },
  //   {
  //     id: 2,
  //     title: 'Studio Apartment Near University',
  //     rent: '$800/month',
  //     description: 'Cozy studio apartment, perfect for students, near campus.',
  //     location: 'University Area, City Name',
  //   },
    // Add more sublease posts as needed
  // ];

  const [subleasePosts, setSubleasePosts] = useState([]);
  const navigate = useNavigate(); // for navigation
  
  useEffect(() => {
    const fetchSubleasePosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subleases'));
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubleasePosts(posts);
      } catch (error){
        console.error('Error fetching sublease posts: ', error);
      }
    };
    fetchSubleasePosts();
  }, []);

  return (
    <div className="home-container">
      <div className="post-list">
        {subleasePosts.map((post) => (
          <SubleasePost
            key={post.id}
            id={post.id}
            address={post.address}
            rent={post.rent}
            numBedrooms={post.numBedrooms}
            numBathrooms={post.numBathrooms}
            sqft={post.sqft}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

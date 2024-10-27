import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import './Favorites.css'; 
import SubleasePost from '../Home/SubleasePost'; 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Assuming you have Firebase config set up

const Favorites = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!loading) {
        if (user == null) {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login?redirect=/favorites'); // Navigate to the login redirect page
      }
    }
  }, [user, loading]); // The effect will run whenever `user` changes

  const [favoriteListings, setFavoriteListings] = useState([]);

  useEffect(() => {
    const fetchFavoriteListings = async () => {
      try {
        // Fetch sublease posts from Firestore (assumed to be the 'subleases' collection)
        const querySnapshot = await getDocs(collection(db, 'subleases'));
        const allSubleases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter favorite listings - assuming favorite IDs are managed and stored
        const favoriteIDs = ['DFKmLzV5WFosN96kLOb9', 'anotherFavoriteID']; // Replace this with dynamic favorite management logic
        const favorites = allSubleases.filter(sublease => favoriteIDs.includes(sublease.id));

        setFavoriteListings(favorites);
      } catch (error) {
        console.error('Error fetching favorite listings: ', error);
      }
    };

    fetchFavoriteListings();
  }, []);

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Favorite Listings</h1>
      <div className="post-list">
        {favoriteListings.length > 0 ? (
          favoriteListings.map((post) => (
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
          ))
        ) : (
          <p>No favorite listings yet!</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;

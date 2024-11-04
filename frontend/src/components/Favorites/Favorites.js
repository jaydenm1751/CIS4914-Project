import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './Favorites.css';
import SubleasePost from '../Home/SubleasePost';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Favorites = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [favoriteListings, setFavoriteListings] = useState([]);


  useEffect(() => {
    if (!loading && !user) {
      console.log('User is not logged in. Redirecting to login...');
      navigate('/login?redirect=/favorites');
    }
  }, [user, loading, navigate]);


  useEffect(() => {
    const fetchFavoriteListings = async () => {
      if (user) {
        try {
          const userId = user.uid;
          const favoritesRef = collection(db, `users/${userId}/favorites`);
          const favoritesSnapshot = await getDocs(favoritesRef);
          

          const favoriteIDs = favoritesSnapshot.docs.map((doc) => doc.id);
          
    
          const subleasesSnapshot = await getDocs(collection(db, 'subleases'));
          const allSubleases = subleasesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));


          const favorites = allSubleases.filter((sublease) => favoriteIDs.includes(sublease.id));
          setFavoriteListings(favorites);
        } catch (error) {
          console.error('Error fetching favorite listings: ', error);
        }
      }
    };

    fetchFavoriteListings();
  }, [user]);

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
              imageUrl={post.imageUrls[0]} 

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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import './SubleasePost.css';

const SubleasePost = ({ id, address, rent, numBedrooms, numBathrooms, sqft, imageUrl }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          const favoriteRef = doc(db, `users/${userId}/favorites`, id);
          const favoriteDoc = await getDoc(favoriteRef);
          if (favoriteDoc.exists()) {
            setIsFavorited(true);
          }
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [id]);

  const handleViewDetails = () => {
    navigate(`/sublease/${id}`);
  };

  const handleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("User not authenticated.");
      return;
    }

    try {
      const favoriteRef = doc(db, `users/${userId}/favorites`, id);
      if (isFavorited) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          id,
          address,
          rent,
          numBedrooms,
          numBathrooms,
          sqft,
          imageUrl,
          timestamp: new Date()
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  return (
    <div className="sublease-post">
      <img
        src={imageUrl}
        alt="Sublease"
        className="sublease-post-image"
        onClick={handleViewDetails}
      />
      <div className="sublease-post-details">
        <h3>{`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</h3>
        <p className="sublease-post-beds-baths-sqft">
          <strong>{numBedrooms}</strong> beds | <strong>{numBathrooms}</strong> baths | <strong>{sqft}</strong> sqft
        </p>
        <p className="sublease-post-rent">
          <span className="rent-amount">${rent}</span> <span className="rent-text">per month</span>
        </p>
        <div className="sublease-post-buttons">
          <button className="sublease-post-button" onClick={handleViewDetails}>
            View Details
          </button>
          <button
            className={`sublease-post-favorite ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavorite}
          >
            {isFavorited ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubleasePost;

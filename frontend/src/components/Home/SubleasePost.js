import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubleasePost.css';

const SubleasePost = ({ id, address, rent, numBedrooms, numBathrooms, sqft, imageUrl }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/sublease/${id}`);
  };

  return (
    <div className="sublease-post">
      <div className="sublease-post-rank">#1</div> {/* Ranking Badge */}
      <img
        src={imageUrl}
        alt="Sublease"
        className="sublease-post-image"
        onClick={handleViewDetails}a
      />
      <div className="sublease-post-details">
        <h3>{`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</h3>
        <p className="sublease-post-beds-baths-sqft">
          <strong>{numBedrooms}</strong> beds | <strong>{numBathrooms}</strong> baths | <strong>{sqft}</strong> sqft
        </p>
        <p className="sublease-post-rent">
          <span className="rent-amount">${rent}</span> <span className="rent-text">per month</span>
        </p>
        <button className="sublease-post-button" onClick={handleViewDetails}> {}
          View Details
        </button>
      </div>
    </div>
  );
};

export default SubleasePost;

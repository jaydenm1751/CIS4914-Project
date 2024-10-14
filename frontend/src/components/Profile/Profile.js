import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../../contexts/UserContext';
import './Profile.css'; 
import profilePicture from '../../assets/images/profilePicture.jpg';

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (user == null) {
      console.log('User is not logged in. Redirecting to login...');
      navigate('/login-redirect/'); // Navigate to the login redirect page
    }
  }, [user]); // The effect will run whenever `user` changes

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h1 className="profile-name">User Name</h1>
          <div className="profile-follow-info">
            <span>100 Following</span> | <span>200 Followers</span>
          </div>
          <div className="profile-status">Seller/Buyer Status</div>
          <div className="profile-location">Gainesville, Florida</div>
        </div>
      </div>

      {/* Profile Description */}
      <div className="profile-description">
        <div className="description-item-container">
          <div className="description-item">
            <h2>Phone Number</h2>
            <p>(123) 456-7890</p>
          </div>

          <div className="description-item">
            <h2>Social Media</h2>
            <p>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>
            </p>
          </div>

          <div className="description-item">
            <h2>Email</h2>
            <p>temp@ufl.edu</p>
          </div>
        </div>

        <div className="description-item">
          <h2>Biography</h2>
          <p>
            Temporary Biography
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

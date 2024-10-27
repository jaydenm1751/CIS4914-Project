import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './NavBar.css';
import logo from '../../assets/images/logo.png'; // Import the logo image
import AuthPopup from '../Auth/AuthPopup.js';
import { logout } from '../Auth/Auth.js';

const NavBar = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchClick = () => {
    navigate('/search'); // Navigate to the search page
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

  const handleLogout = async () => {
    await logout();
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        <img src={logo} alt="Subleaser Logo" className="logo-image" /> {/* Use the logo image */}
      </div>
      <div className="navbar-search">
        <button className="search-button" onClick={handleSearchClick}>
          Search Apartments
        </button>
      </div>
      <div className="navbar-menu">
        <button className="menu-button">Menu</button>
        <div className="dropdown-content">
          {user ? (
            <a onClick={handleLogout}>Log Out</a>
          ) : (
            <a href="/login">Log In</a>
          )}
          <a href="/profile">Profile</a>
          <a href="/favorites">Favorites</a>
          <a href="/messages">Messages</a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

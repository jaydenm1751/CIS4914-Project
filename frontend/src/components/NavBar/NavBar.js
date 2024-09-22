import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './NavBar.css';
import logo from '../../assets/images/logo.png'; // Import the logo image
import Auth from '../Auth/Auth';

const NavBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchClick = () => {
    navigate('/search'); // Navigate to the search page
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

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
      <Auth />
      <div className="navbar-menu">
        <button className="menu-button">Menu</button>
        <div className="dropdown-content">
          <a href="/profile">Profile</a>
          <a href="/favorites">Favorites</a>
          <a href="/messages">Messages</a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

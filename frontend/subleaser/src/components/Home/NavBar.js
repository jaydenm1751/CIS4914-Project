import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchClick = () => {
    navigate('/search'); // Navigate to the search page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Subleaser</div>
      <div className="navbar-search">
        <button className="search-button" onClick={handleSearchClick}>
          Search
        </button>
      </div>
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

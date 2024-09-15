import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home.js';
import Login from './components/Login/Login.js';
import Profile from './components/Profile/Profile.js';
import Search from './components/Search/Search.js';
import Messages from './components/Messages/Messages.js';
import Favorites from './components/Favorites/Favorites.js';
import NavBar from './components/NavBar/NavBar.js';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
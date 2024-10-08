import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { UserContext } from '../../contexts/UserContext';
import AuthPopup from './AuthPopup';
import './Auth.css';

const Auth = () => {
  const { user } = useContext(UserContext);

  const logout = async () => {
      try{
        console.log("logging out user")
        await signOut(auth);
      } catch (error) {
        console.error("Error during sign-out:", error);
      }
    }

  return (
      <div>
          {user ? (
              <button className='logout-button' onClick={logout}>Log Out</button>
          ) : (
              <AuthPopup />
          )}
      </div>
  );
};

export default Auth;
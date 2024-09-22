import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import AuthPopup from './AuthPopup';
import './Auth.css';

const Auth = () => {
    const [user, setUser] = useState(null);

    const logout = async () => {
        try{
          await signOut(auth);
        } catch (error) {
          console.error(error);
        }
      }

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          console.log(user?.email);
        });
      }, []);

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
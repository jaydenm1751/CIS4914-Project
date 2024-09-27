import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
 } from 'firebase/auth';
import './AuthPopup.css'; 

const AuthPopup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const loginEmailAndPassword = async () => {
    try {
      setError(null); // Reset error state before attempt
      await signInWithEmailAndPassword(auth, email, password);
    } catch(err) {
      console.log(err.code);

      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError("Invalid email or password.");
          break;
        case 'auth/invalid-credential':
          setError("Invalid email or password.");
          break;
        default:
          console.error(err.code);
      }
    }
  }
  const loginWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
    .catch((err) => {
      console.error(err);
    });
  }

  return (
    <div>
        <h2 className='popup-text'>Log In</h2>

        <input 
            type = "email"
            placeholder = "Email..."
            onChange={(e) => setEmail(e.target.value)}
        />

        <input 
            type = "password"
            placeholder = "Password..."
            onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className='popup-text'>{error}</p>}

        <button onClick={loginEmailAndPassword}>Log In</button>  
        <button onClick={loginWithGoogle}>Log In with Google</button>     
    </div>
  );
};

export default AuthPopup;

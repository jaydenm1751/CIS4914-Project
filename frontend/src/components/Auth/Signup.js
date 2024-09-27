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
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState(null);

  const registerEmailAndPassword = async () => {
    try {
      setError(null); // Reset error state before attempt
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);

      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("This email is unavailable");
          break;
        case 'auth/weak-password':
          setError("The password is too weak.");
          break;
        default:
          console.error(err.code);
      }
    }
  }

  return (
    <div>
        <h2 className='popup-text'>Sign Up</h2>
        
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
              
        <button onClick={registerEmailAndPassword}>Sign Up</button>
    </div>
  );
};

export default AuthPopup;

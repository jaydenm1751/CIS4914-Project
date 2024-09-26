import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import './AuthPopup.css'; 

const AuthPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState(null);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const loginEmailAndPassword = async () => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch(err) {
      console.log(err.code);

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
  const registerEmailAndPassword = async () => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);

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
      <button className='popup-button' onClick={togglePopup}>Log In</button>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">    
            {!newUser ? <h2 className='popup-text'>Log In</h2> : <h2 className='popup-text'>Sign Up</h2>}
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
            {!newUser ? (
              <div>
                <button onClick={loginEmailAndPassword}>
                  Log In
                </button>
                <p className='popup-text'>
                  New to Subleaser? <span className="blue-text" onClick={() => {setNewUser(true)}}>Sign Up</span>
                </p>
              </div>
            ) : (
              <div>
                <button onClick={registerEmailAndPassword}>
                  Sign Up
                </button>
                <p className='popup-text'>
                  Already have an account? <span className="blue-text" onClick={() => {setNewUser(false)}}>Log In</span>
                </p>
              </div>
            )}; 
            <button onClick={loginWithGoogle}>Log In with Google</button>           
            <button className="close-button" onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPopup;

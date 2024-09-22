import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import './AuthPopup.css'; 

const AuthPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState(null);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const loginEmailAndPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  }
  const registerEmailAndPassword = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  }
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
    .then((result) => {
      setUser(result.user);
    }).catch((error) => {
      console.error(error);
    });
  }
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(user?.email);
    });
  }, []);

  return (
    <div>
      <button className='popup-button' onClick={togglePopup}>Log In</button>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">    
            {!newUser ? <h2 className='popup-text'>Log In</h2> : <h2 className='popup-text'>Sign Up</h2>}
            <button onClick={loginWithGoogle}>Log In with Google</button>
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
            <button className="close-button" onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPopup;

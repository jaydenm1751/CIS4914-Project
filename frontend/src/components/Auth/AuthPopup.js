import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import './AuthPopup.css'; 

const AuthPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState(1); // 1==Login, 2==Sign Up, 3==Reset Password

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className='popup-button' onClick={togglePopup}>Log In</button>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            {activeScreen === 1 && 
              <div>
                <Login />
                <p className='popup-text'>
                    Forgot Password? <span className="blue-text" onClick={() => setActiveScreen(3)}>Reset Password</span>
                </p>
                <p className='popup-text'>
                    New to Subleaser? <span className="blue-text" onClick={() => setActiveScreen(2)}>Sign Up</span>
                </p>
              </div>
            }
            {activeScreen === 2 && (
              <div>
                <Signup />
                <p className='popup-text'>
                  Already have an account? <span className="blue-text" onClick={() => setActiveScreen(1)}>Log In</span>
                </p>
              </div>
            )}
            {activeScreen === 3 && (
              <div>
                <ResetPassword />
                <button onClick={() => setActiveScreen(1)}>Cancel</button>
              </div>
            )}
            
            <button className="close-button" onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPopup;

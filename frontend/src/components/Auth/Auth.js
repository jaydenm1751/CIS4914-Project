import { React, useState } from 'react';
import './Auth.css';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';

const Auth = () => {
  const [activeScreen, setActiveScreen] = useState(1); // 1==Login, 2==Sign Up, 3==Reset Password

  return (
    <div>
          {activeScreen === 0 ? (
            <div>
              <ResetPassword />
              <button onClick={() => setActiveScreen(1)}>Cancel</button>
            </div>
          ) : (
            <div>
              {activeScreen === 1 && 
                <div>
                  <Login />
                  <p className='popup-text'>
                      Forgot Password? <span className="blue-text" onClick={() => setActiveScreen(3)}>Reset Password</span>
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
            </div>
          )}
    </div>
  );
};

export default Auth;
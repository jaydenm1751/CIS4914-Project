import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './AuthPopup.css'; 

const AuthPopup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const resetPassword = async () => {
    try {
      setError(null);  // Clear previous errors
      if (!email) {
        setError("Please enter your email to reset your password.");
        return;
      }
      
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError("No account found with this email.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email.");
          break;
        default:
          setError(err.message);
      }
    }
  };

  return (
    <div>
        <h2 className='popup-text'>Reset Password</h2>

        <input 
            type = "email"
            placeholder = "Email..."
            onChange={(e) => setEmail(e.target.value)}
        />

        {success && 
            <div>
                <p className='popup-text'>{success}</p>
                
            </div>
        }

        {error && <p className='popup-text'>{error}</p>}
              
        <button onClick={resetPassword}>Send Password Reset</button>
    </div>
  );
};

export default AuthPopup;

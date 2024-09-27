import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './AuthPopup.css'; 

const AuthPopup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const resetPassword = async () => {
    try {
      setError(null);  // Clear previous errors
      if (!email) {
        setError("Please enter your email to reset your password.");
        return;
      }

      // Firebase method to send the reset email
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent! Please check your inbox.");
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

        {error && <p className='popup-text'>{error}</p>}
              
        <button onClick={resetPassword}>Send Password Reset</button>
    </div>
  );
};

export default AuthPopup;

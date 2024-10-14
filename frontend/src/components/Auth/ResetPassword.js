import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Auth.css'; 
import {
  Button,
  Typography,
  TextField,
} from '@mui/material';

const ResetPassword = () => {
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
      <Typography variant='h6' align="center" sx={{ fontWeight: 'bold' }}>
        Forgot your password?
      </Typography>

      <Typography variant='body1' align="center">
        Enter your email and we'll send you a password reset link.
      </Typography>

      {/* Email Field */}
      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Email
      </Typography>
      <TextField
          label="Enter email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
      />

      <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={resetPassword}
      >
          Send
      </Button>
    </div>
  );
};

export default ResetPassword;

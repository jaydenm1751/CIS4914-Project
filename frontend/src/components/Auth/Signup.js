import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';
import {
  Button,
  Typography,
  TextField,
} from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const registerEmailAndPassword = async () => {
    try {
      setError(null); // Reset error state before attempt
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

  return (
    // <div>
    //     <h2 className='popup-text'>Sign Up</h2>

    //     <input 
    //         type = "email"
    //         placeholder = "Email..."
    //         onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <input 
    //         type = "password"
    //         placeholder = "Password..."
    //         onChange={(e) => setPassword(e.target.value)}
    //     />

    //     {error && <p className='popup-text'>{error}</p>}
              
    //     <button onClick={registerEmailAndPassword}>Sign Up</button>
    // </div>

    <div>
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

      {/* Password Field */}
      <Typography variant="body1" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
          Password
      </Typography>
      <TextField
          label="Create password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />

      {error && <Typography color="red" align="center" sx={{ marginTop: 2 }}>{error}</Typography>}

      <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={registerEmailAndPassword}
      >
          Register
      </Button>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import './Auth.css'; 
import {
  Button,
  Typography,
  TextField,
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const loginEmailAndPassword = async () => {
    try {
      setError(null); // Reset error state before attempt
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
  const loginWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
    .catch((err) => {
      console.error(err);
    });
  }

  return (
    // <div>
    //     <h2 className='popup-text'>Log In</h2>

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

    //     <button onClick={loginEmailAndPassword}>Log In</button>  
    //     <button onClick={loginWithGoogle}>Log In with Google</button>     

        
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
          label="Enter password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />

      <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={loginEmailAndPassword}
      >
          Log In
      </Button>
    </div> 
  );
};

export default Login;

import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../config/firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      createUserProfile(userCredential.user);
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

  const createUserProfile = async (user) => {
    const userProfileRef = doc(db, 'profiles', user.uid);
  
    try {
      const userProfileDoc = await getDoc(userProfileRef);

      if (!userProfileDoc.exists()) {
        const username = user.email.split('@')[0]; // Extract username from email
        await setDoc(userProfileRef, {
          uid: user.uid,
          username: username,
          email: user.email,
          createdOn: new Date(),
        });
        console.log('Profile with Google created: ', username)
      } else {
        console.log('Profile already exists: ', userProfileDoc)
      }
    } catch (err) {
      console.log('error fetching or creating profile', err)
    }
    console.log("Creating profile");
  };

  return (
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

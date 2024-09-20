import React from 'react';
import { useState } from 'react';
import { auth } from '../../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const registerEmailAndPassword = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>SIGN UP PAGE</h1>

      <div>
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

        <button onClick={registerEmailAndPassword}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;

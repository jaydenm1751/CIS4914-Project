import React from 'react';
import { useState } from 'react';
import { auth } from '../../../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  }

  const logout = async () => {
    try{
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>LOGIN PAGE</h1>

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

        <button onClick={login}>
          Login
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Login;

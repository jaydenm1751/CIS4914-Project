// src/components/AuthComponent.js
import React, { useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //console.log(auth.currentUser.email);
  const signIn = async () => {
    try{
      await createUserWithEmailAndPassword(auth, email, password);
    }
    catch(err){
      console.log(err);
    } 
    };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={signIn}>Login</button>
      
    </div>
  );
};

export default AuthComponent; 

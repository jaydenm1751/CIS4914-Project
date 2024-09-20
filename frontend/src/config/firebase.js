// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };


const firebaseConfig = {
    apiKey: "AIzaSyCFzBnbRKpVVyS4LOUEG54mWjOJNc8UcXY",
    authDomain: "subleaser-10437.firebaseapp.com",
    projectId: "subleaser-10437",
    storageBucket: "subleaser-10437.appspot.com",
    messagingSenderId: "147356733124",
    appId: "1:147356733124:web:da09c4434baa95a7648391",
    measurementId: "G-HY5E850V32"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);       // Authentication
export const db = getFirestore(app);    // Firestore
export const storage = getStorage(app); // Storage
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCfaq5cNLuYFmX7APe0CDD-RRC0nT-jR4",
  authDomain: "gym-management-system-3714d.firebaseapp.com",
  projectId: "gym-management-system-3714d",
  storageBucket: "gym-management-system-3714d.appspot.com",
  messagingSenderId: "639552080370",
  appId: "1:639552080370:web:023acbe12d073fa242036b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

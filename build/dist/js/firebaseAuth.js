// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"; // if using Realtime DB
// to deploy this website to firebase ensure all updates are reflected in the "build" folder then in the Terminal (powerbash) type "firebase deploy --only hosting"

// Your Firebase config (from Firebase Console)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAlKnngYNeJH60pIMwPIFs5OVOE4fwyaJ8",
  authDomain: "iriswebsite-3316d.firebaseapp.com",
  databaseURL: "https://iriswebsite-3316d-default-rtdb.firebaseio.com",
  projectId: "iriswebsite-3316d",
  storageBucket: "iriswebsite-3316d.firebasestorage.app",
  messagingSenderId: "616812338141",
  appId: "1:616812338141:web:988c650f8dd6d430413434",
  measurementId: "G-0R7Z8FL5LD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Export initialized services
export const auth = getAuth(app);
//export const db = getDatabase(app);
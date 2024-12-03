// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYf2A07f-r7YIEzMXi7VsYBBriDmq9vHw",
  authDomain: "timesheet-9e31d.firebaseapp.com",
  projectId: "timesheet-9e31d",
  storageBucket: "timesheet-9e31d.firebasestorage.app",
  messagingSenderId: "932616984402",
  appId: "1:932616984402:web:d507f0495e70bc1dc78c8b",
  measurementId: "G-XJS1HSPPL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
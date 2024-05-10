// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCeArBX1455WxPuGMoaodiER7NID0JFsE",
  authDomain: "spaza-1ad3f.firebaseapp.com",
  projectId: "spaza-1ad3f",
  storageBucket: "spaza-1ad3f.appspot.com",
  messagingSenderId: "648976149277",
  appId: "1:648976149277:web:ba9644191bf5d2f17dcff4",
  measurementId: "G-89HZGHTENC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
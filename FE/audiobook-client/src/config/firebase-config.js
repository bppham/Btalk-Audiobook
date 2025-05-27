// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD89NtSsYdtuQg9T6KjoNEiv5jEMVWafTM",
  authDomain: "audiobook-d87dc.firebaseapp.com",
  projectId: "audiobook-d87dc",
  storageBucket: "audiobook-d87dc.firebasestorage.app",
  messagingSenderId: "1027071725238",
  appId: "1:1027071725238:web:2b0c2e3309c88af983e017",
  measurementId: "G-1G2QK8ET99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
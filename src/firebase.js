// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSQivX41l48mnAYehuJGcU2FHzEpfHgUE",
  authDomain: "turnosapp-14e8b.firebaseapp.com",
  projectId: "turnosapp-14e8b",
  storageBucket: "turnosapp-14e8b.firebasestorage.app",
  messagingSenderId: "1094594571259",
  appId: "1:1094594571259:web:10ee87622b0c91ab63395e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

export { db };
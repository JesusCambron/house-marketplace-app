// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTszA4fy48ZODECD7OzNfhK3sy32_37R8",
  authDomain: "house-marketplace-app-a0a99.firebaseapp.com",
  projectId: "house-marketplace-app-a0a99",
  storageBucket: "house-marketplace-app-a0a99.appspot.com",
  messagingSenderId: "175245530994",
  appId: "1:175245530994:web:d404ab7f43b9dff87cafeb",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

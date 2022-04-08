// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOCLcmMv0eOjeyQk63PABWC-H8c7miLkc",
  authDomain: "email-password-auth-141a6.firebaseapp.com",
  projectId: "email-password-auth-141a6",
  storageBucket: "email-password-auth-141a6.appspot.com",
  messagingSenderId: "471474441986",
  appId: "1:471474441986:web:0efa12c7613a76c3f23c1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
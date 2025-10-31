// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA4zFRM-ibz6cI3LG-RgT99QDnerCzW4dg",
  authDomain: "atvsiteprograma.firebaseapp.com",
  projectId: "atvsiteprograma",
  storageBucket: "atvsiteprograma.firebasestorage.app",
  messagingSenderId: "1084777667701",
  appId: "1:1084777667701:web:5b49ea46ff9efb52832c3c",
  measurementId: "G-69BH9E7934"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFnn4MKooKNufd05da2pOaOe-H6Yw-dSM",
  authDomain: "estoque-pimenta-de-cheiro.firebaseapp.com",
  projectId: "estoque-pimenta-de-cheiro",
  storageBucket: "estoque-pimenta-de-cheiro.appspot.com",
  messagingSenderId: "50202520622",
  appId: "1:50202520622:web:9ab134e840715d65ae83bf",
  measurementId: "G-W1HLDTKYKW"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

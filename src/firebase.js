// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkLVwpa73kMrlYzwMwSF_Vw2kTsGJCoXw",
  authDomain: "work-hours-tracker-1509f.firebaseapp.com",
  projectId: "work-hours-tracker-1509f",
  storageBucket: "work-hours-tracker-1509f.firebasestorage.app",
  messagingSenderId: "293261158049",
  appId: "1:293261158049:web:05e62ece740f3d4ad472e0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth = getAuth(app);

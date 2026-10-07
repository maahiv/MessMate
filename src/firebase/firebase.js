import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: "AIzaSyCA0XTL0R6H0IFK4z9dL3iLYfEorrl77JY",
  authDomain: "messmate-41e5f.firebaseapp.com",
  projectId: "messmate-41e5f",
  storageBucket: "messmate-41e5f.firebasestorage.app",
  messagingSenderId: "898972616954",
  appId: "1:898972616954:web:d1fe90ed002a440fcfe143"
};

export const firebaseReady = Object.values(config).every(Boolean);

const app = firebaseReady ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBcDSyVg1tvYqHJteOUyE8r7cb5swSTnVg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aicompiler-45c59.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aicompiler-45c59",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aicompiler-45c59.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "334749977360",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:334749977360:web:6a693a232e993ae87fb395"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

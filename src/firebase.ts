import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwhPnqjisfQH1fa0k3bh82oxJRNoMbx3w",
  authDomain: "agriengage.firebaseapp.com",
  projectId: "agriengage",
  storageBucket: "agriengage.firebasestorage.app",
  messagingSenderId: "845393970955",
  appId: "1:845393970955:web:bc4d4f7ff348e12def040e",
  measurementId: "G-3JG2M3P7R7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

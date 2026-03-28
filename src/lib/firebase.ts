import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Helper to get env var or localStorage fallback
const getEnv = (key: string) => import.meta.env[key] || localStorage.getItem(key) || "";

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID"),
};

// Check if config is valid
export const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingKeys.length === 0;

let app: FirebaseApp;
let auth: Auth;

if (isFirebaseConfigured) {
  // Prevent duplicate initialization in dev HMR
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
} else {
  console.warn(
    `Missing Firebase configuration keys: ${missingKeys.join(", ")}. ` +
    "App will show configuration screen."
  );
  // We export undefined auth here, consumer must check isFirebaseConfigured
}

export { auth };

export const saveConfig = (config: Record<string, string>) => {
  Object.entries(config).forEach(([key, val]) => {
    if (val) localStorage.setItem(key, val);
  });
  window.location.reload();
};


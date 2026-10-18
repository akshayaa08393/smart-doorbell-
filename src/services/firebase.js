// Firebase Service Configuration and Initialization with Auto-Fallback
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read Firebase config from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if all essential keys are provided
const hasValidConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your_api_key_here" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your_project_id"
);

let app = null;
let auth = null;
let firestore = null;
let storage = null;
let isConfigured = false;
let configError = null;

if (hasValidConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    isConfigured = true;
    console.log("🟢 [Firebase] Connected successfully to project:", firebaseConfig.projectId);
  } catch (err) {
    console.warn("🟡 [Firebase] Initialization failed, falling back to Demo/Local Mode:", err.message);
    configError = err.message;
    isConfigured = false;
  }
} else {
  console.info("🟡 [Firebase] No environment variables configured. Running in Demo / Mock Mode.");
}

export { app, auth, firestore, storage };

export function isFirebaseActive() {
  return isConfigured;
}

export function getFirebaseStatus() {
  if (isConfigured) {
    return {
      connected: true,
      mode: "Connected",
      projectId: firebaseConfig.projectId,
      message: `Active Firestore & Storage (${firebaseConfig.projectId})`
    };
  }
  return {
    connected: false,
    mode: "Demo Mode",
    projectId: null,
    message: configError
      ? `Config Error: ${configError}`
      : "Running in Local Offline Simulation Mode (No hardware or cloud setup required)"
  };
}

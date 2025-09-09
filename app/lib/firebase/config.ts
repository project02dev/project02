import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-hmznMK1peXGqD23lmYcCKevr1EeyULg",
  authDomain: "project-02-f569f.firebaseapp.com",
  projectId: "project-02-f569f",
  storageBucket: "project-02-f569f.firebasestorage.app",
  messagingSenderId: "86987299083",
  appId: "1:86987299083:web:f34b61fc7862414a8c6a0e",
  measurementId: "G-0JD59GGWPH",
};

// Initialize Firebase
let app: FirebaseApp | undefined;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only in browser
let analytics = null;
if (typeof window !== "undefined") {
  // Check if analytics is supported
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

// Development mode settings
if (process.env.NODE_ENV === "development") {
  // Enable local emulator if needed
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
}

export { app, auth, db, analytics };

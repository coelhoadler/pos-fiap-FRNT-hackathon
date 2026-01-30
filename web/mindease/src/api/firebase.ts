import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwEzlq5xpyS84AovNlbBKmdv6OoghnRos",
  authDomain: "mindease-a1223.firebaseapp.com",
  databaseURL: "https://mindease-a1223-default-rtdb.firebaseio.com",
  projectId: "mindease-a1223",
  storageBucket: "mindease-a1223.firebasestorage.app",
  messagingSenderId: "408782528907",
  appId: "1:408782528907:web:ab52cefdd1134db5554f8e",
  measurementId: "G-XHQB4NSTLC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
    analytics = null;
  }
}

export { app, analytics, auth };

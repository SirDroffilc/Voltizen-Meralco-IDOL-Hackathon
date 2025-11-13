import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASVtaZuCkdd7wWNdwApukMdN9rIkBYYuw",
  authDomain: "voltizen-9f5fa.firebaseapp.com",
  projectId: "voltizen-9f5fa",
  storageBucket: "voltizen-9f5fa.firebasestorage.app",
  messagingSenderId: "909590105943",
  appId: "1:909590105943:web:15ce8c5c30ac972e613812",
  measurementId: "G-QGY3VE94FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
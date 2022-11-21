// Essentials
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Auth
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxFkgnhfdHXhxOEsw9SR3r0TqadQWTKZo",
  authDomain: "balenciaga-mockup.firebaseapp.com",
  projectId: "balenciaga-mockup",
  storageBucket: "balenciaga-mockup.appspot.com",
  messagingSenderId: "9627108461",
  appId: "1:9627108461:web:fb8946121925076658eb64",
  measurementId: "G-5V1S0T524N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
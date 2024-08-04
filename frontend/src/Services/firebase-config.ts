// src/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Optionally import other Firebase services

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvNEuYXienDuZSYBsRGRiJzUiIjKKEzVw",
  authDomain: "respriz.firebaseapp.com",
  projectId: "respriz",
  storageBucket: "respriz.appspot.com",
  messagingSenderId: "486863139916",
  appId: "1:486863139916:web:a538164ab9fb87c789b0e9",
  measurementId: "G-0YDHGXX0SP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export Firebase services
export { app, auth, firestore };

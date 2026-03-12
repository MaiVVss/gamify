// Firebase configuration for Gamify Life
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAE_8Bo6GeEyxBaFdkTZXOYcwwJBdws9-k",
  authDomain: "gamify-ced85.firebaseapp.com",
  projectId: "gamify-ced85",
  storageBucket: "gamify-ced85.firebasestorage.app",
  messagingSenderId: "643924697500",
  appId: "1:643924697500:web:f62630155f23e21980a859",
  measurementId: "G-Y33H240S83"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: force account selection
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;

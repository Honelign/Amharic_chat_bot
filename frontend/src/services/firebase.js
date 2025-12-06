// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC66jZfm9iV3BsLEMnEDQKMrkWirhykzbo",
  authDomain: "amharicchatbot.firebaseapp.com",
  projectId: "amharicchatbot",
  storageBucket: "amharicchatbot.firebasestorage.app",
  messagingSenderId: "978486401436",
  appId: "1:978486401436:web:27a7b3083cfd9e5def5059",
  measurementId: "G-F3XGH4EF7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
};

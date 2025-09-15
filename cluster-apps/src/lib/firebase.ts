// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpkPaXskXkOXT3pwO0mxIqkwKc1fSf30A",
  authDomain: "hima-clusterapps.firebaseapp.com",
  databaseURL: "https://hima-clusterapps-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hima-clusterapps",
  storageBucket: "hima-clusterapps.firebasestorage.app",
  messagingSenderId: "331850493801",
  appId: "1:331850493801:web:57ab960130e416b9bb57f8",
  measurementId: "G-YEY38KLBBG"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseAnalytics = getAnalytics(firebaseApp);

export const usersDocRef = collection(firestoreDB, "users")
export const userInterestsDocRef = collection(firestoreDB, "userInterests")

export const googleAuthProvider = new GoogleAuthProvider();
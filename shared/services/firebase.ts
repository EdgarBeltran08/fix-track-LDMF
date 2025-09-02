import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmAoozhfJOvceM1Cywm1L8YUzKEND0Fd4",
  authDomain: "fix-track-9e24c.firebaseapp.com",
  projectId: "fix-track-9e24c",
  storageBucket: "fix-track-9e24c.firebasestorage.app",
  messagingSenderId: "632487064290",
  appId: "1:632487064290:web:0e9bd6f2ea21395c0da4bb",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

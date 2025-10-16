import { getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUYBrlfW4ZiCarqr2_w_sQWMq-0Ykl7g8",
  authDomain: "fix-track-2.firebaseapp.com",
  projectId: "fix-track-2",
  storageBucket: "fix-track-2.firebasestorage.app",
  messagingSenderId: "453559085337",
  appId: "1:453559085337:web:41a503f56af4f5ef57bd88",
  measurementId: "G-BSPLKCERSH"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);

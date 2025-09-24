import { getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmAoozhfJOvceM1Cywm1L8YUzKEND0Fd4",
  authDomain: "fix-track-9e24c.firebaseapp.com",
  projectId: "fix-track-9e24c",
  storageBucket: "fix-track-9e24c.firebasestorage.app",
  messagingSenderId: "632487064290",
  appId: "1:632487064290:web:0e9bd6f2ea21395c0da4bb",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);

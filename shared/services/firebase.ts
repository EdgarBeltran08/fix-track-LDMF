import { getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkIZpmA81hbd95qhpsQrxEmnvMSxi6Yt8",
  authDomain: "fixtrack-lab.firebaseapp.com",
  projectId: "fixtrack-lab",
  storageBucket: "fixtrack-lab.firebasestorage.app",
  messagingSenderId: "586087672871",
  appId: "1:586087672871:web:fd31b52754e2c625bd7202",
  measurementId: "G-88PVCRDZ89"

};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);

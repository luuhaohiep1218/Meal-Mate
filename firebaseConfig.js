// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9uHlWOdi1fzxItOPlLYP2bauvGhFeOpY",
  authDomain: "mealmate-f60cc.firebaseapp.com",
  projectId: "mealmate-f60cc",
  storageBucket: "mealmate-f60cc.firebasestorage.app",
  messagingSenderId: "852942516467",
  appId: "1:852942516467:web:12064e1f845ed446364786",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };

// IOS: 384508604797-lk2sjv5kmtm5i2cujqkb11nojvgu2uke.apps.googleusercontent.com
// Android: 384508604797-um7ohonkodsvboiigfu0mpadosftuokh.apps.googleusercontent.com

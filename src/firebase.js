import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBRaJJc87z6JzooENDxqgDQPLAfzztwdGk",
  authDomain: "i-mazed.firebaseapp.com",
  projectId: "i-mazed",
  storageBucket: "i-mazed.appspot.com",
  messagingSenderId: "127491059907",
  appId: "1:127491059907:web:7d90895d9ccaac2020b276"
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Retrieve firebase messaging instance
const messaging = getMessaging(app);

export { messaging };

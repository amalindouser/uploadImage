// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMpB1xrK7uE0rmQFzpsAF7tDHaxtKWOFc",
  authDomain: "portofolioupdate.firebaseapp.com",
  projectId: "portofolioupdate",
  storageBucket: "portofolioupdate.appspot.com",
  messagingSenderId: "717961348115",
  appId: "1:717961348115:web:305882c3187cb99a506be6",
  measurementId: "G-S75PZ4W0YZ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { storage, auth };

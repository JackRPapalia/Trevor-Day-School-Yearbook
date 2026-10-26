// Firebase SDK functions loaded straight from Google's CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Connection settings for the "yearbook-site" Firebase project
// (these are public identifiers, not secrets; access is controlled by Firebase security rules)
const firebaseConfig = {
  apiKey: "AIzaSyBuuzamF59UD32dJkuj-POjgncJtvFCpf8",
  authDomain: "yearbook-site.firebaseapp.com",
  projectId: "yearbook-site",
  storageBucket: "yearbook-site.firebasestorage.app",
  messagingSenderId: "368439470997",
  appId: "1:368439470997:web:a7bb371e1cbcc8831e249c"
};

// Start Firebase and share the login (auth) and database (db) objects with other scripts
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

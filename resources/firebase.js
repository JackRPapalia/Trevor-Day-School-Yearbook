import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuuzamF59UD32dJkuj-POjgncJtvFCpf8",
  authDomain: "yearbook-site.firebaseapp.com",
  projectId: "yearbook-site",
  storageBucket: "yearbook-site.firebasestorage.app",
  messagingSenderId: "368439470997",
  appId: "1:368439470997:web:a7bb371e1cbcc8831e249c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuuzamF59UD32dJkuj-POjgncJtvFCpf8",
  authDomain: "yearbook-site.firebaseapp.com",
  projectId: "yearbook-site",
  storageBucket: "yearbook-site.firebasestorage.app",
  messagingSenderId: "368439470997",
  appId: "1:368439470997:web:a7bb371e1cbcc8831e249c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const isInPages = window.location.pathname.includes("/pages/");
const navbarPath = isInPages ? "../navbar.html" : "navbar.html";

fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    document.body.style.paddingTop = document.querySelector(".nav").offsetHeight + "px";

    onAuthStateChanged(auth, async user => {
      const loginItem = document.querySelector('.nav-links a[href*="login"]')?.parentElement;
      const dashboardItem = document.getElementById("nav-dashboard");

      if (loginItem) loginItem.style.display = user ? "none" : "";

      if (user && dashboardItem) {
        const userDoc = await getDoc(doc(db, "users", user.email));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          dashboardItem.style.display = "";
        }
      }
    });
  });

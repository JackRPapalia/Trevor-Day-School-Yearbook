import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

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

const isInPages = window.location.pathname.includes("/pages/");
const navbarPath = isInPages ? "../navbar.html" : "navbar.html";

fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    document.body.style.paddingTop = document.querySelector(".nav").offsetHeight + "px";

    onAuthStateChanged(auth, user => {
      const loginItem = document.querySelector('.nav-links a[href*="login"]')?.parentElement;
      if (loginItem) {
        loginItem.style.display = user ? "none" : "";
      }
    });
  });

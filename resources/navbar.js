import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

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

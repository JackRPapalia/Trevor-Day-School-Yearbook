import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const isInPages = window.location.pathname.includes("/pages/");
const navbarPath = isInPages ? "../resources/navbar.html" : "resources/navbar.html";

fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    document.body.style.paddingTop = document.querySelector(".nav").offsetHeight + "px";

    document.getElementById("nav-login-btn").addEventListener("click", async e => {
      e.preventDefault();
      try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        if (!result.user.email.endsWith("@trevor.org")) {
          await signOut(auth);
          alert("Only Trevor Day School accounts are allowed.");
        }
      } catch (err) {
        console.error("Sign-in error:", err);
      }
    });

    document.getElementById("logout-btn").addEventListener("click", async e => {
      e.preventDefault();
      await signOut(auth);
    });

    onAuthStateChanged(auth, async user => {
      const loginItem = document.getElementById("nav-login-btn").parentElement;
      const logoutItem = document.getElementById("nav-logout");
      const dashboardItem = document.getElementById("nav-dashboard");

      loginItem.style.display = user ? "none" : "";
      logoutItem.style.display = user ? "" : "none";

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.email));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            dashboardItem.style.display = "";
          } else {
            dashboardItem.style.display = "none";
          }
        } catch {
          dashboardItem.style.display = "none";
        }
      } else {
        dashboardItem.style.display = "none";
      }
    });
  });

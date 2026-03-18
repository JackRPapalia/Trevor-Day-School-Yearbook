import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// Handle redirect result from Google sign-in
const result = await getRedirectResult(auth);
if (result) {
  const user = result.user;
  if (user.email.endsWith("@trevor.org")) {
    window.location.href = "/Trevor-Day-School-Yearbook/";
  } else {
    await signOut(auth);
    alert("Only Trevor Day School accounts are allowed.");
  }
}

const isInPages = window.location.pathname.includes("/pages/");
const navbarPath = isInPages ? "../resources/navbar.html" : "resources/navbar.html";

fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    document.body.style.paddingTop = document.querySelector(".nav").offsetHeight + "px";

    // Login button click triggers Google sign-in redirect
    document.getElementById("nav-login-btn")?.addEventListener("click", async e => {
      e.preventDefault();
      await signInWithRedirect(auth, new GoogleAuthProvider());
    });

    onAuthStateChanged(auth, async user => {
      const loginItem = document.getElementById("nav-login-btn")?.parentElement;
      const dashboardItem = document.getElementById("nav-dashboard");

      if (loginItem) loginItem.style.display = user ? "none" : "";

      const logoutItem = document.getElementById("nav-logout");
      if (logoutItem) logoutItem.style.display = user ? "" : "none";

      document.getElementById("logout-btn")?.addEventListener("click", async e => {
        e.preventDefault();
        await signOut(auth);
        window.location.href = "/Trevor-Day-School-Yearbook/";
      });

      if (user && dashboardItem) {
        const userDoc = await getDoc(doc(db, "users", user.email));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          dashboardItem.style.display = "";
        }
      }
    });
  });

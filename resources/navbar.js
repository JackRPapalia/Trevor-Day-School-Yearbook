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
      console.log("Auth state changed, user:", user ? user.email : "not logged in");
      const loginItem = document.getElementById("nav-login-btn").parentElement;
      const logoutItem = document.getElementById("nav-logout");
      const seniorFormsItem = document.getElementById("nav-senior-forms");

      loginItem.style.display = user ? "none" : "";
      logoutItem.style.display = user ? "" : "none";

      if (user) {
        try {
          const seniorsDoc = await getDoc(doc(db, "config", "classof2027"));
          const members = seniorsDoc.exists() ? seniorsDoc.data().members : [];
          console.log("Signed in as:", user.email);
          console.log("Allowed members:", members);
          seniorFormsItem.style.display = members.includes(user.email) ? "" : "none";
        } catch (err) {
          console.error("Senior forms check failed:", err);
          seniorFormsItem.style.display = "none";
        }
      } else {
        seniorFormsItem.style.display = "none";
      }
    });
  });

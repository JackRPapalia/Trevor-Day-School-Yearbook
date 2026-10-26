// Firebase login and database functions, plus this site's Firebase connection
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// Pages inside /pages/ need to go up one folder to reach resources/navbar.html
const isInPages = window.location.pathname.includes("/pages/");
const navbarPath = isInPages ? "../resources/navbar.html" : "resources/navbar.html";

// Load the navbar HTML and insert it into the page's #navbar placeholder
fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    // Push the page content down so the fixed navbar doesn't cover it
    document.body.style.paddingTop = document.querySelector(".nav").offsetHeight + "px";

    // Login button: sign in with Google, and only allow @trevor.org accounts
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

    // Logout button: sign the user out
    document.getElementById("logout-btn").addEventListener("click", async e => {
      e.preventDefault();
      await signOut(auth);
    });

    // Runs on page load and whenever the user logs in or out
    onAuthStateChanged(auth, async user => {
      console.log("Auth state changed, user:", user ? user.email : "not logged in");
      const loginItem = document.getElementById("nav-login-btn").parentElement;
      const logoutItem = document.getElementById("nav-logout");
      const seniorFormsItem = document.getElementById("nav-senior-forms");

      // Show Login when logged out, Logout when logged in
      loginItem.style.display = user ? "none" : "";
      logoutItem.style.display = user ? "" : "none";

      if (user) {
        // Show the Senior Forms link only if the user's email is in the config/classof2027 member list
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
        // Logged-out visitors never see the Senior Forms link
        seniorFormsItem.style.display = "none";
      }
    });
  });

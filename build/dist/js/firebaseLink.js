import { auth } from "./firebaseAuth.js";
// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
    
/*
import { getDatabase, ref, push, set, serverTimestamp
        , update
        , query, orderByChild, equalTo, get
          } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
// to deploy this website to firebase ensure all updates are reflected in the "build" folder then in the Terminal (powerbash) type "firebase deploy --only hosting"

// Your Firebase config (from Firebase Console)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlKnngYNeJH60pIMwPIFs5OVOE4fwyaJ8",
  authDomain: "iriswebsite-3316d.firebaseapp.com",
  databaseURL: "https://iriswebsite-3316d-default-rtdb.firebaseio.com",
  projectId: "iriswebsite-3316d",
  storageBucket: "iriswebsite-3316d.firebasestorage.app",
  messagingSenderId: "616812338141",
  appId: "1:616812338141:web:988c650f8dd6d430413434",
  measurementId: "G-0R7Z8FL5LD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var auth = getAuth(app);
*/

var theUser;
var userId;
export let theUserId="";

export function sanitizeInput(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// Example: Create a new user
export function createUser(){
  var email = sanitizeInput(document.getElementById("emailAddress").value);
  var password = sanitizeInput(document.getElementById("userPassword").value);
  var emailC = sanitizeInput(document.getElementById("emailAddressCreate").value);
  var passwordC = sanitizeInput(document.getElementById("userPasswordCreate").value);
  var passwordC2 = sanitizeInput(document.getElementById("userPasswordCreate2").value);
  const theDiv = document.getElementById("divLogInOrCreate");
  

  try{
    if(emailC.trim() !="" && passwordC.trim() !="" && passwordC2.trim() !="" && passwordC === passwordC2){
      createUserWithEmailAndPassword(auth, emailC, passwordC)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          theUser = user;
          theUserId = user.uid;
          document.getElementById("status").textContent = "✅ Logged in as: " + user.email;
          console.log("User created:", user.uid);
          theDiv.style.display = "none"; // hide
          window.location.href = "comments.html"; // redirect to comments page
        })
        .catch((error) => {
          theUserId = error.message;
          console.error("Error:", error.code, error.message);
          document.getElementById("status").textContent = theUserId;
          theDiv.style.display = "block"; // show
        });
    }else if(emailC.trim() ===""){
      document.getElementById("status").textContent = "❌ Error: email cannot be empty!";
    }
    else if(passwordC.trim() ===""){
      document.getElementById("status").textContent = "❌ Error: password cannot be empty!";
    }
    else if(passwordC2.trim() ===""){
      document.getElementById("status").textContent = "❌ Error: password2 cannot be empty!";
    }
    else if(passwordC.trim() != passwordC2.trim()){
      document.getElementById("status").textContent = "❌ Error: passwords must match!";
    }
    else{
      document.getElementById("status").textContent = "❌ Error: input cannot be empty!";
    }
  }
  catch{

  }
  
};

// Login user
export function logIn(){
  var email = document.getElementById("emailAddress").value;
  var password = document.getElementById("userPassword").value;
  const theDiv = document.getElementById("divLogInOrCreate");

  var theUserId;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      theUser = user;
      theUserId = user.uid;
      document.getElementById("status").textContent = "✅ Logged in as: " + user.email;
      console.log("User logged in:", user);
      theDiv.style.display = "none"; // hide
      window.location.href = "comments.html"; // redirect to comments page
    })
    .catch((error) => {
      document.getElementById("status").textContent = "❌ Error: " + error.message;
      console.error("Login failed:", error.code, error.message);
      theDiv.style.display = "block"; // show
    });
  };

  export function toggleLogIn() {
  const divCreate = document.getElementById("createUserDiv");
  const divLogIn = document.getElementById("logInDiv");
  const theButton = document.getElementById("chooseNewUser");
  if (divCreate.style.display === "none") {
    divCreate.style.display = "block"; // show
    divLogIn.style.display = "none"; // hide
    theButton.value = "Log In Instead"; //Change button text
  } else {
    divCreate.style.display = "none"; // hide
    divLogIn.style.display = "block"; // show
    theButton.value = "Create New User"; //Change button text
  }
}

export function turnOnLogInAndCreate() {
  const theDiv = document.getElementById("divLogInOrCreate");

  theDiv.style.display = "block"; // show
  theDiv.style.display = "none"; // hide

}
  // Listen for auth state (to check if logged in or logged out)
onAuthStateChanged(auth, (user) => {
  //const theDiv = document.getElementById("divLogInOrCreate");
  if (user) {
    theUserId = user.uid;
    document.getElementById("status").textContent = `✅ Logged in as ${user.email}`;

    const myDiv = document.getElementById("divLogInOrCreate")
    if(myDiv){
      myDiv.style.display = "none";
    } else {
    console.warn("myDiv not found in the DOM yet!");
}


    const myDiv2 = document.getElementById("logoutBtn")
    if(myDiv2){
      myDiv2.style.display = "block"; // show
    }
    //theDiv.style.display = "none"; // hide
  } else {
    document.getElementById("status").textContent = "❌ Not logged in";
    const myDiv3 = document.getElementById("logoutBtn")
    if(myDiv3){
      myDiv3.style.display = "none"; // hide
    }
    //theDiv.style.display = "block"; // show
  }
});

// Logout button action
export function logOut() {
  const theDiv = document.getElementById("divLogInOrCreate");
  document.getElementById("emailAddress").value = "";
  document.getElementById("userPassword").value = "";
  document.getElementById("emailAddressCreate").value = "";
  document.getElementById("userPasswordCreate").value = "";
  signOut(auth)
    .then(() => {
      document.getElementById("status").textContent = "✅ Successfully logged out";
      theDiv.style.display = "block"; // show
      theUser = null;
      console.log("User signed out.");
    })
    .catch((error) => {
      document.getElementById("status").textContent = "❌ Error logging out: " + error.message;
      console.error("Logout error:", error);
    });
    
  };




// Bind to button in JS
const btn1 = document.getElementById("chooseNewUser");
if (btn1){
  btn1.addEventListener("click", () => {
  toggleLogIn();
});}
const btn2 = document.getElementById("createUser");
if (btn2){
  btn2.addEventListener("click", () => {
  createUser();
});}
const btn3 = document.getElementById("logIn")
if (btn3){
  btn3.addEventListener("click", () => {
  logIn();
});}
const btn4 = document.getElementById("logoutBtn")
if (btn4){
  btn4.addEventListener("click", () => {
  logOut();
});}





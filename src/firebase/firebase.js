import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
  }

  async signInWithEmailAndPass(email, password) {
    return await this.auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log("user:", user);
      })
      .catch((error) => {
        console.log(error.code);
        // var errorCode = error.code;
        // var errorMessage = error.message;
      });
  }

  async signInWithEmail(email) {
    const actionCodeSettings = {
      url: "http://localhost:3000/finishSignUp?cartId=1234",
      handleCodeInApp: true,
    };
    return await this.auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
      })
      .catch((error) => {
        var errorCode = error.code;
        console.log(errorCode);
      });
  }

  isSignInWithEmailLink() {
    if (this.auth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      this.auth
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          console.log("res", result);
          window.localStorage.removeItem("emailForSignIn");
        })
        .catch((error) => {
          console.log(error.code);
        });
    }
  }
}
const firebase = new Firebase();
export default firebase;

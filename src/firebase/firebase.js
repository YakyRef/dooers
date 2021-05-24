import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.storage = app.storage();
    this.db = app.firestore();
  }
  // Auth methods.
  async isSignedIn() {
    return await this.auth.onAuthStateChanged();
  }

  async logout() {
    await this.auth.signOut();
  }

  getUserUid() {
    return this.auth.currentUser.uid;
  }
  userIdToken() {
    return this.auth.currentUser.getIdToken(true);
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
      url: "http://localhost:3000/finishSignUp",
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
          if (result.user) {
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.log(error.code);
        });
    }
  }
  // Storage methods.
  createStorageFileReference(path, filename) {
    return this.storage.ref().child(`${path}/${filename}`);
  }
  STATE_CHANGED() {
    return this.storage.TaskEvent.STATE_CHANGED;
  }
  RUNNING() {
    return this.storage.TaskState.RUNNING;
  }
  // Firestore methods.
  // async getAdminUsers() {
  //   return await
  // }
}
const firebase = new Firebase();
export default firebase;

import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
  }

  async signInWithEmail(email, password) {
    return await this.auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log("user:", user);
      })
      .catch((error) => {
        console.log(error);
        // var errorCode = error.code;
        // var errorMessage = error.message;
      });
  }
}
const firebase = new Firebase();
export default firebase;

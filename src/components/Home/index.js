import React, { useEffect } from "react";
import firebase from "../../firebase";
const USER_DETAILS = {
  email: "yaky.refael@yahoo.com",
  password: "abc123",
};
function Home() {
  useEffect(() => {
    console.log("goo!!");
    firebase.signInWithEmail(USER_DETAILS.email);
    // firebase.signInWithEmailAndPass(USER_DETAILS.email, USER_DETAILS.password);
  });
  return <div>home</div>;
}
export default Home;

import React, { useEffect } from "react";
import firebase from "../../firebase";
function FinishSignUp() {
  useEffect(() => {
    firebase.isSignInWithEmailLink();
  });
  return <div>FinishSignUp</div>;
}
export default FinishSignUp;

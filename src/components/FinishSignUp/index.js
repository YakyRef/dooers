import React, { useEffect } from "react";
import { Spin } from "antd";
import "./style.scss";

import firebase from "../../firebase";
function FinishSignUp(props) {
  useEffect(() => {
    firebase.isSignInWithEmailLink();
  }, []);
  return (
    <div className="finish-sign-up">
      <Spin className="finish-sign-up__spinner" size="large" />
      <br />
      <p>Finish sign-up</p>
    </div>
  );
}
export default FinishSignUp;

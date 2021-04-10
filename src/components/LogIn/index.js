import React from "react";
import firebase from "../../firebase/";
const USER_DETAILS = {
  email: "yaky.refael@yahoo.com",
  password: "abc123",
};

function LogIn(props) {
 
  function loginClickHandler(){
    firebase.signInWithEmailAndPass(
      USER_DETAILS.email,
      USER_DETAILS.password
    ).then(()=>{
      props.history.push('/')
    })
  }
  return (
    <div>
      <h4>LogIn</h4>
      <button
        onClick={loginClickHandler}
      >
        log-in
      </button>{" "}
    </div>
  );
}
export default LogIn;

import React, { useContext, useEffect } from "react";
import firebase, { FirebaseContext } from "../../firebase/";
const USER_DETAILS = {
  email: "yaky.refael@yahoo.com",
  password: "abc123",
};

function LogIn(props) {
  const { user } = useContext(FirebaseContext);
  useEffect(() => {
    if (user) {
      props.history.push("/");
    }
  });

  function loginClickHandler() {
    firebase
      .signInWithEmailAndPass(USER_DETAILS.email, USER_DETAILS.password)
      .then(() => {
        props.history.push("/");
      });
  }

  return (
    <div>
      <button onClick={loginClickHandler}>log-in</button>{" "}
    </div>
  );
}
export default LogIn;

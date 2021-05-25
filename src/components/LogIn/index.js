import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function LogIn(props) {
  const { user } = useContext(FirebaseContext);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (user) {
      props.history.push("/");
    }
  });

  function loginClickHandler() {
    firebase
      .signInWithEmail(email)
      .then(() => alert("Please check your email"))
      .catch((error) => console.log(error));
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  return (
    <div>
      4
      <input
        name="username"
        value={email}
        onChange={handleEmailChange}
        placeholder="Please enter your email"
      />
      <button onClick={loginClickHandler}>log-in</button>{" "}
    </div>
  );
}
export default LogIn;

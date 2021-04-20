import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";
const USER_DETAILS = {
  email: "yaky.refael@yahoo.com",
  password: "abc123",
};

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
      .signInWithEmail(USER_DETAILS.email)
      .then(() => alert("Please check your email"))
      .catch((error) => console.log(error));
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    console.log(e.target.value);
  }

  return (
    <div>
      <input
        name="username"
        value={email}
        onChange={handleEmailChange}
        placeholder="Please enter your name"
      />
      <button onClick={loginClickHandler}>log-in</button>{" "}
    </div>
  );
}
export default LogIn;

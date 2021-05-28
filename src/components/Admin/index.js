import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) {
      getConfig();
    }
  }, [user, admin]);

  async function getConfig() {
    await firebase.db
      .collection("appConfig")
      .doc("admins")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const admins = doc.data()?.uuids;
          const currentUserUid = firebase.getUserUid();
          if (admins?.length && admins.includes(currentUserUid)) {
            setAdmin(true);
          } else {
            props.history.push("/sorry");
          }
        }
      })
      .catch((error) => {
        firebase.logout();
        props.history.push("/sorry");
      });
  }
  function loginClickHandler() {
    firebase
      .signInWithEmail(email)
      .then(() => alert("Please check your email"))
      .catch((error) => console.log(error));
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function providerLogInHandler() {
    firebase
      .signInWithGoogle()
      .then((result) => {
        // var user = result.user;
        // getConfig();
        // if (!admin) {
        //   props.history.push("/sorry");
        // }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`${errorCode}, ${errorMessage}`);
      });
  }

  return user && admin ? (
    <div>
      <br />
      <input
        name="username"
        value={email}
        onChange={handleEmailChange}
        placeholder="Please enter dooer email"
      />
      &nbsp;&nbsp;
      <button onClick={loginClickHandler}>Send email invitation</button>
    </div>
  ) : (
    <div>
      <button onClick={providerLogInHandler}>Log In</button>
    </div>
  );
}
export default Admin;

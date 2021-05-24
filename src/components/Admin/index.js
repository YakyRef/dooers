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
  }, [user]);

  function getConfig() {
    firebase.db
      .collection("appConfig")
      .doc("admins")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const admins = doc.data()?.uuids;
          const currentUserUid = firebase.getUserUid();
          if (admins?.length && admins.includes(currentUserUid)) {
            setAdmin(true);
          }
        } else {
          props.history.push("/login");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
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

  return user && admin ? (
    <div>
      <br />
      <input
        name="username"
        value={email}
        onChange={handleEmailChange}
        placeholder="Please enter dooer email"
      />
      <button onClick={loginClickHandler}>log-in</button>{" "}
    </div>
  ) : (
    <div>-</div>
  );
}
export default Admin;

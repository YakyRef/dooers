import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState({});
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) {
      checkIfAdmin();
    }
  }, [user, admin]);

  async function checkIfAdmin() {
    const currentUserUid = await firebase.getUserUid();
    const docRef = await firebase.db
      .collection("administrators")
      .doc(currentUserUid);
    docRef
      .get()
      .then((doc) => {
        const isAdmin = doc.data()?.isAdmin;
        if (isAdmin) {
          setAdmin(true);
        } else {
          logOut();
        }
      })
      .catch((error) => {
        logOut();
      });
  }
  function loginClickHandler() {
    firebase
      .signInWithEmail(email)
      .then(() =>
        setInvitedUsers((prevState) => ({ ...prevState, [email]: true }))
      )
      .catch((error) => console.log(error));
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function providerLogInHandler() {
    firebase.signInWithGoogle().catch((error) => {
      console.log(error);
    });
  }
  function logOut() {
    firebase.logout();
    props.history.push("/sorry");
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
      {Object.keys(invitedUsers).length &&
        Object.keys(invitedUsers).map((user) => <div>{user}</div>)}
    </div>
  ) : (
    <div>
      <button onClick={providerLogInHandler}>Log In</button>
    </div>
  );
}
export default Admin;

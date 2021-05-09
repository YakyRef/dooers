import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const { user } = useContext(FirebaseContext);

  // useEffect
  // check  after user is updated, if includes in admins array
  // yes : show Form
  // no : redirect to root and log to db
  useEffect(() => {
    if (!user) {
      console.log("admin no user");
    } else {
      const currentUserUid = firebase.getUserUid();
      let adminUsers = [];
      firebase.getAdminUsers().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });
      });
      console.log(currentUserUid);
      console.log(adminUsers);
      // console.log(adminUsers.includes(currentUserUid));
      setAdmin(true);
    }
  }, [user]);
  return (
    <div>
      <h1> admin</h1>{" "}
      <button onClick={() => firebase.getAdminUsers()}>get admin</button>{" "}
    </div>
  );
}
export default Admin;

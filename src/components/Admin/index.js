import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
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

  return user && admin ? <div>user</div> : <div>no</div>;
}
export default Admin;

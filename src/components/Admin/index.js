import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function Admin(props) {
  const { user } = useContext(FirebaseContext);
  const adminLogin = async () => {
    // Getting user's token
    let idToken = user ? await firebase.userIdToken() : "0";

    // // URL to fetch
    // let url = "FIREBASE_CLOUD_FUNCTION_URL";

    // // Waiting for response
    // let response = await fetch(url, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ idToken: idToken }),
    // });

    // // If response ok, set as admin
    // if (response.ok) {
    //   // Waiting for the json response
    //   let json = await response.json();

    //   // Is admin?
    //   let isAdmin = json.isAdmin;

    //   // Setting new state
    //   setAdmin(isAdmin);
    // }
    console.log(idToken);
  };
  useEffect(() => {
    console.log(111);
    adminLogin();
  });
  return <div>admin</div>;
}
export default Admin;

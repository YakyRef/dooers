import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [campaign, setCampaignName] = useState("");
  const [campaigns, updateCampaigns] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState({});
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) {
      checkIfAdmin();
    }
    if (admin) {
      getCampaignsFromDb();
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
  function inviteUsers() {
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
  function handleCampaignChange(e) {
    setCampaignName(e.target.value);
  }

  function getCampaignsFromDb() {
    let campaignsSet = [];
    firebase.db
      .collection("campaigns")
      .orderBy("start")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          campaignsSet.push(doc.id);
        });
        updateCampaigns(campaignsSet);
      })
      .then(() => {
        setCampaignName(campaignsSet[campaignsSet.length - 1]);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
  function setCampaign() {
    // add new document
    firebase.db
      .collection("campaigns")
      .doc(campaign)
      .set({
        start: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Campaign was set");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    // update all campaigns woth new 'current'=false
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
      <button onClick={inviteUsers}>Send email invitation</button>
      {Object.keys(invitedUsers).length
        ? Object.keys(invitedUsers).map((user) => <div key={user}>{user}</div>)
        : null}
      <br />
      <br />
      <label htmlFor="campaign">Current campaign name: </label>
      <input
        name="campaign"
        value={campaign}
        onChange={handleCampaignChange}
        placeholder="Canpain name"
      />
      &nbsp;&nbsp;
      <button onClick={setCampaign}>Update</button>
    </div>
  ) : (
    <div>
      <button onClick={providerLogInHandler}>Log In</button>
    </div>
  );
}
export default Admin;

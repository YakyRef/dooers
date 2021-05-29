import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";
import { getCampaignsFromDb } from "../../firebase/helpers";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [campaign, setCampaignName] = useState("");
  const [historicalCampaigns, setHistoricalCampaigns] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState({});
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) {
      const isAdmin = firebase.userIsAdmin();
      if (isAdmin) {
        setAdmin(true);
      } else {
        logOut();
      }
    }
    if (admin) {
      getCampaigns();
    }
  }, [user, admin]);

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
  async function getCampaigns() {
    const campaigns = await getCampaignsFromDb();
    if (campaigns.length) {
      setHistoricalCampaigns(campaigns);
      setCampaignName(campaigns[campaigns.length - 1]);
    } else {
      setHistoricalCampaigns(["base-campaign"]);
      setCampaignName("base-campaign");
    }
  }
  function setCampaign() {
    firebase.db
      .collection("campaigns")
      .doc(campaign)
      .set({
        start: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setHistoricalCampaigns((prevState) => [...prevState, campaign]);
        alert("Campaign was set");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  return user && admin ? (
    <div className="admin">
      <div className="invite">
        <input
          name="username"
          value={email}
          onChange={handleEmailChange}
          placeholder="Please enter dooer email"
        />
        &nbsp;&nbsp;
        <button onClick={inviteUsers}>Send email invitation</button>
        {Object.keys(invitedUsers).length
          ? Object.keys(invitedUsers).map((user) => (
              <div key={user}>{user}</div>
            ))
          : null}
      </div>
      <div className="campaigns">
        <label htmlFor="campaign">Current campaign name: </label>
        <input
          name="campaign"
          value={campaign}
          onChange={handleCampaignChange}
          placeholder="Canpain name"
        />
        &nbsp;&nbsp;
        <button onClick={setCampaign}>Update</button>
        <div>Historical Canpaigns</div>
        <ul>
          {historicalCampaigns.length &&
            historicalCampaigns.map((campaign) => (
              <li key={campaign}>{campaign}</li>
            ))}
        </ul>
      </div>
    </div>
  ) : (
    <div>
      <button onClick={providerLogInHandler}>Log In</button>
    </div>
  );
}
export default Admin;

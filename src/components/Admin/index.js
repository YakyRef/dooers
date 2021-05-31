import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";
import { getCampaignsFromDb } from "../../firebase/helpers";
import "./style.scss";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [campaign, setCampaignName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserFiles, setSelectedUserFiles] = useState({});
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
      {/* Invite users */}
      <div className="admin__invite">
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
      {/* Set campaign */}
      <div className="admin__campaigns">
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
      {/* Download files */}
      <div className="admin__download">
        <h5>Download images instruction</h5>
        <ol>
          <li>
            install{" "}
            <a
              target="blank"
              href="https://cloud.google.com/storage/docs/gsutil_install#windows"
            >
              gsutil
            </a>
            , for windows (direct installer :{" "}
            <a
              href="https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
              target="blank"
            >
              Cloud SDK installer
            </a>
            )
          </li>
          <li>
            After the installation finish, open the "Google cloud SDK shell"
          </li>
          <li>
            if it is the first time using, please choose "outstand-337" project
          </li>
          <li>
            Run the following command :
            "gs://outstand-337bc.appspot.com/(CAMPAIGN-NAME) ."
          </li>
          <li>
            If you want to download specific user images from campaign, Run the
            following command :
            "gs://outstand-337bc.appspot.com/(CAMPAIGN-NAME)/(User-Email) ."
          </li>
          <li>than run from terminal : "explorer ."</li>
        </ol>
      </div>
    </div>
  ) : (
    <div>
      <button onClick={providerLogInHandler}>Log In</button>
    </div>
  );
}
export default Admin;

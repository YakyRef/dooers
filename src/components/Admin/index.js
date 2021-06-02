import { Button, Divider, Typography, Input, Tag, List } from "antd";
import { UserOutlined, CheckOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import firebase, { FirebaseContext } from "../../firebase/";
import { getCampaignsFromDb } from "../../firebase/helpers";
import "./style.scss";

function Admin(props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [campaign, setCampaignName] = useState("");
  const [historicalCampaigns, setHistoricalCampaigns] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState({});
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) {
      adminCheck();
    }
  }, [user, admin]);

  const adminCheck = async () => {
    if (admin) {
      getCampaigns();
      return;
    }
    const currentUserUid = await firebase.getUserUid();
    const docRef = await firebase.db
      .collection("administrators")
      .doc(currentUserUid);
    docRef
      .get()
      .then((doc) => {
        const isAdmin = doc.data()?.isAdmin || false;
        setAdmin(isAdmin);
      })
      .catch((error) => {
        logOut();
      });
  };

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
      <Typography.Title level={4}>Send Invitation to user :</Typography.Title>
      <div className="admin__invite">
        <Input
          name="username"
          className="username"
          value={email}
          onChange={handleEmailChange}
          placeholder="Please enter dooer email"
          size="large"
          prefix={<UserOutlined />}
        />
        &nbsp;&nbsp;
        <Button type="primary" size="large" onClick={inviteUsers}>
          Send email invitation
        </Button>
      </div>

      {Object.keys(invitedUsers).length
        ? Object.keys(invitedUsers).map((user) => (
            <Tag key={user} color="gold">
              <CheckOutlined />
              &nbsp;&nbsp;
              {user}
            </Tag>
          ))
        : null}
      <Divider />
      {/* Set campaign */}
      <br />
      <Typography.Title level={4}>Campaigns settings:</Typography.Title>
      <div className="admin__campaigns">
        <label htmlFor="campaign">Set new campaign name: </label>
        <Input
          name="campaign"
          className="campaign"
          type="text"
          size="large"
          value={campaign}
          onChange={handleCampaignChange}
          placeholder="Canpain name"
        />
        &nbsp;&nbsp;
        <Button onClick={setCampaign} type="primary" size="large">
          Update
        </Button>
      </div>
      {historicalCampaigns.length ? (
        <List
          style={{ width: "50%" }}
          size="small"
          header={
            <div
              style={{
                color: "#262626",
                background: "#ffd6e7",
                borderColor: "#ffe58f",
              }}
            >
              Historical Canpaigns
            </div>
          }
          bordered
          dataSource={historicalCampaigns}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      ) : null}

      <Divider />
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
            Run the following command : "gsutil -m cp -R
            gs://outstand-337bc.appspot.com/(CAMPAIGN-NAME) ."
          </li>
          <li>
            If you want to download specific user images from campaign, Run the
            following command : "gsutil -m cp -R
            gs://outstand-337bc.appspot.com/(CAMPAIGN-NAME)/(User-Email) ."
          </li>
          <li>than run from terminal : "explorer ."</li>
        </ol>
      </div>
    </div>
  ) : (
    <div>
      <Button
        className="admin__log-in-btn"
        type="primary"
        size="large"
        onClick={providerLogInHandler}
      >
        Log In
      </Button>
    </div>
  );
}
export default Admin;

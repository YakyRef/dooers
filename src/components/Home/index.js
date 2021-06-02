import React, { useContext, useRef, useState, useEffect } from "react";
import { FirebaseContext } from "../../firebase";
import { getCampaignsFromDb, logSuccessToDb } from "../../firebase/helpers";
import { Button, Divider, Alert, Progress, Typography, Tag } from "antd";
import { UploadOutlined, CheckOutlined } from "@ant-design/icons";
import "./style.scss";

function Home(props) {
  const [errors, setErrors] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [campaigns, updateCampaigns] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user, firebase } = useContext(FirebaseContext);

  const fileButtonEl = useRef(null);

  useEffect(() => {
    if (user) {
      getCampaigns();
    }
  }, [user]);

  const onFileChange = (e) => {
    setErrors([]);
    setFiles([]);
    setUploadProgress(0);
    setUploadCompleted(false);
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      if (newFile.size > 5000000) {
        setErrors([
          `the size of the image: '${newFile.name}' is more than the maximum. the maximum file size is 5mb`,
        ]);
      } else {
        newFile["id"] = Math.random();
        setFiles((prevState) => [...prevState, newFile]);
      }
    }
  };

  const onUploadClick = (e) => {
    e.preventDefault(); // prevent page refreshing
    setUploading(true);
    const promises = [];
    files.forEach((file) => {
      const uploadTask = firebase
        .createStorageFileReference(
          `${campaigns[campaigns.length - 1]}/${user.email}`,
          file.name
        )
        .put(file);
      promises.push(uploadTask);
      uploadTask.on("state_change", updateProgress, onUploadProgressError);
    });
    Promise.all(promises)
      .then((res) => {
        onUploadFilesComplete();
      })
      .catch((err) => {
        console.log(err.code);
        firebase.analytics.logEvent(`Error - Files uploaded :  ${err.code}`);
      });
  };

  const updateProgress = (snapshot) => {
    let percentage = Math.floor(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    setUploadProgress(percentage);
  };
  const onUploadProgressError = (error) => {
    setErrors([error]);
  };
  const onUploadFilesComplete = () => {
    logSuccessToDb(
      user.email || "unknown",
      files,
      campaigns[campaigns.length - 1]
    );
    firebase.analytics.logEvent(
      `Files uploaded :  ${user.email || "unknown"}, ${files.map(
        (file) => file.name
      )}, ${campaigns[campaigns.length - 1]} `
    );
    setFiles([]);
    setUploadCompleted(true);
    setUploading(false);
  };
  async function getCampaigns() {
    const campaigns = await getCampaignsFromDb();
    campaigns.length
      ? updateCampaigns(campaigns)
      : updateCampaigns(["base-campaign"]);
  }

  return user ? (
    <div className="home">
      <Typography.Title level={2}>Upload Images :</Typography.Title>
      {uploadProgress > 0 ? (
        <Progress
          id="uploader"
          percent={uploadProgress}
          status="active"
          strokeColor={{
            from: "#108ee9",
            to: "#87d068",
          }}
          strokeWidth="30px"
        />
      ) : null}

      {uploadCompleted && !errors.length && (
        <Alert
          message="Upload Completed"
          type="success"
          showIcon
          style={{ marginTop: "2vh" }}
        />
      )}
      <Divider />

      <Button
        type="primary"
        icon={<UploadOutlined />}
        loading={uploading}
        size="large"
      >
        <label htmlFor="fileButton"> Choose images to upload (PNG, JPG)</label>
      </Button>
      <input
        id="fileButton"
        name="fileButton"
        ref={fileButtonEl}
        type="file"
        multiple
        onChange={onFileChange}
        placeholder="sasd"
      />

      {files.length
        ? files.map((file) => (
            <Tag key={file.name} color="cyan" className="file-tag">
              <CheckOutlined />
              &nbsp;&nbsp;
              {file.name}
            </Tag>
          ))
        : null}

      {errors.length
        ? errors.map((error, i) => (
            <Alert key={i} message={error} type="error" showIcon />
          ))
        : null}
      <Divider />
      <Button
        className="uploadBtn"
        size="large"
        type="dashed"
        onClick={onUploadClick}
        disabled={errors.length || files.length < 1}
      >
        Upload
      </Button>
    </div>
  ) : (
    <div>sorry</div>
  );
}
export default Home;

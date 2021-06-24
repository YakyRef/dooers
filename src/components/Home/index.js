import React, { useContext, useRef, useState, useEffect } from "react";
import { FirebaseContext } from "../../firebase";
// import { getImageGPS } from "../../helpers/image-helpers";
import exifr from "exifr";
import { getCampaignsFromDb, logSuccessToDb } from "../../firebase/helpers";
import {
  Button,
  Divider,
  Alert,
  Progress,
  Typography,
  Tag,
  Spin,
  Space,
} from "antd";
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
      // File size validation:
      if (newFile.size > 10000000) {
        setErrors((prevState) => [
          ...prevState,
          `the size of the image: '${newFile.name}' is more than the maximum. the maximum file size is 5mb`,
        ]);
      } else {
        newFile["id"] = Math.random();
        // GPS meta data validation:
        exifr.parse(newFile).then((output) => {
          if (output && output.latitude && output.longitude) {
            newFile["coordinates"] = [output.latitude, output.longitude];
            // push file to files state
            setFiles((prevState) => [...prevState, newFile]);
          } else {
            setErrors((prevState) => [
              ...prevState,
              <p>
                There is no GPS data inside : '{newFile.name}'.
                <br /> (see how to enable this on{" "}
                <a href="https://support.apple.com/en-il/HT207092">ios</a> or
                <a href="https://support.google.com/accounts/answer/3467281">
                  android
                </a>
                )
              </p>,
            ]);
          }
        });
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
        firebase.analytics.logEvent("Error - Files uploaded", {
          error: err.code,
        });
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
    firebase.analytics.logEvent("Files uploaded", {
      name: user.email || "unknown",
    });
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
            <Alert
              key={i}
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "1vh" }}
            />
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
    <Space size="middle" align="center">
      <Spin size="large" />
    </Space>
  );
}
export default Home;

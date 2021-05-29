import React, { useContext, useRef, useState, useEffect } from "react";
import { FirebaseContext } from "../../firebase";
import { logSuccessToDb } from "./helpers";
import "./style.scss";
function Home(props) {
  const [errors, setErrors] = useState([]);
  const [files, setFiles] = useState([]);
  const [campaigns, updateCampaigns] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const { user, firebase } = useContext(FirebaseContext);

  const fileButtonEl = useRef(null);
  const progressBarEl = useRef(null);

  useEffect(() => {
    if (user) {
      getCampaignsFromDb();
    }
  }, [user]);

  const onFileChange = (e) => {
    setErrors([]);
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      if (newFile.size > 4000000) {
        setErrors([
          `the size of the image: '${newFile.name}' is more than the maximum. the maximum file size is 4mb`,
        ]);
      } else {
        newFile["id"] = Math.random();
        setFiles((prevState) => [...prevState, newFile]);
      }
    }
  };

  const onUploadClick = (e) => {
    e.preventDefault(); // prevent page refreshing
    const promises = [];
    files.forEach((file) => {
      const uploadTask = firebase
        .createStorageFileReference(
          campaigns.length ? campaigns[campaigns.length - 1] : "base-campaign",
          file.name
        )
        .put(file);
      promises.push(uploadTask);
      uploadTask.on("state_change", updateProgress, onUploadProgressError);
    });
    Promise.all(promises)
      .then((res) => {
        alert("All files uploaded");
        onUploadFilesComplete();
      })
      .catch((err) => console.log(err.code));
  };

  const updateProgress = (snapshot) => {
    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressBarEl.current.value = percentage;
  };
  const onUploadProgressError = (error) => {
    setErrors([error]);
  };
  const onUploadFilesComplete = () => {
    logSuccessToDb(user.email || "unknown", files);
    setFiles([]);
    setUploadCompleted(true);
  };
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
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
  return user ? (
    <div className="home">
      <h3>Upload files</h3>
      <progress min={0} max={100} id="uploader" value={0} ref={progressBarEl}>
        0%
      </progress>

      {errors.length &&
        errors.map((error, i) => (
          <div key={i} className="home__error">
            {error}
          </div>
        ))}

      {uploadCompleted && !errors.length && (
        <div className="home__completed">Upload Completed</div>
      )}
      <label>
        <input
          id="fileButton"
          ref={fileButtonEl}
          type="file"
          multiple
          onChange={onFileChange}
        />
      </label>
      <br />
      <button
        onClick={onUploadClick}
        disabled={errors.length || files.length < 1}
      >
        Upload
      </button>
    </div>
  ) : (
    <div>sorry</div>
  );
}
export default Home;

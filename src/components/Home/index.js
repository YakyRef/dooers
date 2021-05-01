import React, { useContext, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import "./style.scss";
function Home(props) {
  const [error, setError] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const { user, firebase } = useContext(FirebaseContext);

  if (!user) {
    props.history.push("/login");
  }
  const fileButtonEl = useRef(null);
  const progressBarEl = useRef(null);
  // create event listener to "fileButton
  useEffect(() => {
    fileButtonEl.current.addEventListener("change", handleUpload);
    return () => {
      window.removeEventListener("change", handleUpload);
    };
  }, []);

  const handleUpload = (event) => {
    setUploadCompleted(false);
    setError(false);
    // -  Get file
    const file = event.target.files[0];
    // -  Create a storage
    const fileStorageRef = firebase.createStorageFileReference(
      "campain1",
      file.name
    );
    // -  Upload file
    const uploadFileTask = fileStorageRef.put(file);
    // -  Update progress bar
    uploadFileTask.on(
      "state_change",
      updateProgress,
      onUploadProgressError,
      onUploadFileComplete
    );
  };
  const updateProgress = (snapshot) => {
    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressBarEl.current.value = percentage;
  };
  const onUploadProgressError = (error) => {
    setError(error);
  };
  const onUploadFileComplete = () => {
    setUploadCompleted(true);
  };

  return (
    <div className="home">
      <h3>Upload files</h3>
      <progress min={0} max={100} id="uploader" value={0} ref={progressBarEl}>
        0%
      </progress>
      {error && <div className="home__error">error : askjdasl lkasd lkads</div>}
      {uploadCompleted && !error && (
        <div className="home__completed">Upload Completed</div>
      )}
      <input type="file" id="fileButton" ref={fileButtonEl} />
      <div>
        <Link to="/admin">Go to Admin</Link>
      </div>
    </div>
  );
}
export default Home;

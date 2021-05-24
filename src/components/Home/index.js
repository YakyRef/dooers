import React, { useContext, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import "./style.scss";
function Home(props) {
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const { user, firebase } = useContext(FirebaseContext);

  if (!user) {
    props.history.push("/login");
  }
  const fileButtonEl = useRef(null);
  const progressBarEl = useRef(null);

  const onFileChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      // add an "id" property to each File object
      setFiles((prevState) => [...prevState, newFile]);
    }
  };

  const onUploadSubmission = (e) => {
    e.preventDefault(); // prevent page refreshing
    const promises = [];
    files.forEach((file) => {
      const uploadTask = firebase
        .createStorageFileReference("campaign", file.name)
        .put(file);
      promises.push(uploadTask);
      uploadTask.on(
        "state_change",
        updateProgress,
        onUploadProgressError,
        onUploadFileComplete
      );
    });
    Promise.all(promises)
      .then(() => alert("All files uploaded"))
      .catch((err) => console.log(err.code));
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

      <label>
        Select Files
        <input
          id="fileButton"
          ref={fileButtonEl}
          type="file"
          multiple
          onChange={onFileChange}
        />
      </label>
      <br />
      <button onClick={onUploadSubmission}>Upload</button>
      <div>
        <Link to="/admin">Go to Admin</Link>
      </div>
    </div>
  );
}
export default Home;

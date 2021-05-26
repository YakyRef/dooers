import React, { useContext, useRef, useState } from "react";
import { FirebaseContext } from "../../firebase";
import "./style.scss";
function Home(props) {
  const [errors, setErrors] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const { user, firebase } = useContext(FirebaseContext);

  const fileButtonEl = useRef(null);
  const progressBarEl = useRef(null);

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
    setErrors([error]);
  };
  const onUploadFileComplete = () => {
    setUploadCompleted(true);
  };

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
        onClick={onUploadSubmission}
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

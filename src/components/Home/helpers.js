import firebase from "../../firebase";

export const logSuccessToDb = async (userEmail, files) => {
  const fileNames = files.map((file) => file.name);
  const currentUploadDate = firebase.firestore.Timestamp.fromDate(new Date());

  await firebase.db
    .collection("usersUploads")
    .doc(userEmail)
    .set(
      {
        [currentUploadDate]: fileNames,
      },
      { merge: true }
    )
    .then(() => {
      console.log("log success to Db");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

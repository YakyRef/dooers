import firebase from ".";

export const getCampaignsFromDb = async () => {
  let campaignsSet = [];
  await firebase.db
    .collection("campaigns")
    .orderBy("start")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        campaignsSet.push(doc.id);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  return campaignsSet;
};

export const logSuccessToDb = async (userEmail, files, campaign) => {
  const filesToDb = files.map((file) => {
    return { name: file.name, coordinates: file.coordinates };
  });
  const currentUploadDate = firebase.firestore.Timestamp.fromDate(new Date());

  await firebase.db
    .collection("usersUploads")
    .doc(userEmail)
    .set(
      {
        [currentUploadDate]: { campaign, images: filesToDb },
      },
      { merge: true }
    )
    .then(() => {
      // console.log("log success to Db");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

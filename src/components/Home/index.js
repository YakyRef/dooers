import React from "react";
import useAuth from "../../firebase/useAuth";

function Home() {
  const user = useAuth();
  console.log("---", user);
  return <div>Upload files </div>;
}
export default Home;

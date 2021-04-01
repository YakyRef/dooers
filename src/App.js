import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const USER_DETAILS = {
  user: "yaky",
  email: "asd@asd.sd",
};

function App() {
  useEffect(() => {
    // Update the document title using the browser API
    console.log("uuuu");
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h5>Yo Roey! x</h5>
      </header>
    </div>
  );
}

export default App;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "./firebase";
import Home from "./components/Home";
import FinishSignUp from "./components/FinishSignUp";
import "./App.css";
const USER_DETAILS = {
  email: "yaky.refael@yahoo.com",
  password: "abc123",
};

function App() {
  useEffect(() => {
    firebase.auth.onAuthStateChanged((user) => {
      console.log(user);
    });
  });
  return (
    <Router>
      <div className="App">
        <header> header </header>
        <button
          onClick={() =>
            firebase.signInWithEmailAndPass(
              USER_DETAILS.email,
              USER_DETAILS.password
            )
          }
        >
          Sign In
        </button>
        <button onClick={() => firebase.signOut()}>Sign Out</button>
        <Switch>
          <Route path="/finishSignUp">
            <FinishSignUp />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from "./firebase";
import Home from "./components/Home";
import FinishSignUp from "./components/FinishSignUp";
import "./App.css";
import LogIn from "./components/LogIn";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/login">Login</Link>&nbsp;|
          <button onClick={() => firebase.logout()}>Log Out</button>
        </nav>
        <Switch>
          <Route path="/finishSignUp" component={FinishSignUp} />
          <Route path="/login" component={LogIn} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

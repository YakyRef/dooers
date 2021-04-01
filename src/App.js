import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import FinishSignUp from "./components/FinishSignUp";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header> header </header>
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

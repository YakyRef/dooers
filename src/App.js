import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase, { FirebaseContext } from "./firebase";
import Home from "./components/Home";
import FinishSignUp from "./components/FinishSignUp";
import Sorry from "./components/Sorry";
import Admin from "./components/Admin";
import NavBar from "./components/NavBar";
import useAuth from "./firebase/useAuth";
import "./App.css";

function App() {
  const user = useAuth();
  return (
    <Router>
      <FirebaseContext.Provider value={{ user, firebase }}>
        <div className="App">
          {user && <NavBar logout={firebase.logout} user={user} />}
          <Switch>
            <Route path="/finishSignUp" component={FinishSignUp} />
            <Route path="/sorry" component={Sorry} />
            <Route path="/admin" component={Admin} />
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </FirebaseContext.Provider>
    </Router>
  );
}

export default App;

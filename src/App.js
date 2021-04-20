import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase, { FirebaseContext } from "./firebase";
import Home from "./components/Home";
import FinishSignUp from "./components/FinishSignUp";
import LogIn from "./components/LogIn";
import useAuth from "./firebase/useAuth";
import "./App.css";

function App() {
  const user = useAuth();
  return (
    <Router>
      <FirebaseContext.Provider value={{ user, firebase }}>
        <div className="App">
          <nav>
            {user ? (
              <>
                <button onClick={() => firebase.logout()}>Log Out</button>{" "}
                |&nbsp;
                <span>Hello {user.displayname || user.email}</span>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
          <Switch>
            <Route path="/finishSignUp" component={FinishSignUp} />
            <Route path="/login" component={LogIn} />
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </FirebaseContext.Provider>
    </Router>
  );
}

export default App;

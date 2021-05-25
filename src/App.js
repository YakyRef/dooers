import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase, { FirebaseContext } from "./firebase";
import Home from "./components/Home";
import FinishSignUp from "./components/FinishSignUp";
import Sorry from "./components/Sorry";
import Admin from "./components/Admin";
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
            ) : null}
          </nav>
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

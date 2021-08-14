import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Messenger from "./pages/messenger/Messenger";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {sessionStorage.getItem("userId") ? <Home /> : <Register />}
        </Route>
        <Route path="/login">
          <Login />
          {/* {user ? <Home /> : <Login />} */}
        </Route>
        <Route path="/register">
          <Register />
          {/* {user ? <Home /> : <Register />} */}
        </Route>
        <Route path="/messenger">
          {!user ? <Redirect to="/login" /> : <Messenger />}
        </Route>
        <Route path="/profile/:userId">
          <Profile />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;

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

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Router exact path="/">
          {sessionStorage.getItem("userId") ? <Home /> : <Register />}
        </Router>
        <Router path="/login">
          <Login />
          {/* {user ? <Home /> : <Login />} */}
        </Router>
        <Router path="/register">
          <Register />
          {/* {user ? <Home /> : <Register />} */}
        </Router>
        <Router path="/profile/:userId">
          <Profile />
        </Router>
      </Switch>
    </Router>
  )
}

export default App;

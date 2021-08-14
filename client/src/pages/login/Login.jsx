import './login.css';
import { useContext, useRef } from 'react';
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom"

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const loginCall = async (userCredential, dispatch) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post("/auth/login", userCredential);
            dispatch({ type: "LOGIN_SUCCESS", load: res.data });
        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE", load: error });
        }
    };

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch);
    };
    if (user) {
        sessionStorage.userId = user._id;
        window.location.href = "/";
    };

    return (
        <div className="loginCotainer">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social</h3>
                    <span className="loginDesc">Connect with everyone and the world around you</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" required type="email" className="loginInput" ref={email} />
                        <input placeholder="Password" required type="password" className="loginInput" ref={password} />
                        <button type="submit" className="loginButton">{isFetching ? <CircularProgress color="white" size="20px" /> : "Log in"}</button>
                        <span className="loginForgot">Forgot password ?</span>
                        <Link to="/register">
                            <button className="loginRegisterButton">Create a new account</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
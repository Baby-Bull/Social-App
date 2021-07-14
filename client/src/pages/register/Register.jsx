import axios from 'axios';
import { useRef } from 'react'
import { useHistory } from 'react-router';
import './register.css'

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    //const history = useHistory();

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Doesn't match the entered password");
        }else{
            const user = {
                username : username.current.value,
                email: email.current.value,
                password : password.current.value,
                passwordAgain: passwordAgain.current.value
            }
            try {
                await axios.post("/auth/register", user);
                //history.push("/login");
                window.location.href = "http://localhost:3000/login";
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <div className="loginCotainer">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social</h3>
                    <span className="loginDesc">Connect with everyone and the world around you</span>
                </div>
                <div className="loginRight" >
                    <form className="registerBox" onSubmit={handleClick}>
                        <input placeholder="Username" type="text" required className="loginInput" ref={username} />
                        <input placeholder="Email" type="email" required className="loginInput" ref={email} />
                        <input placeholder="Password" type="password" required className="loginInput" ref={password} />
                        <input placeholder="Password again" type="password" required className="loginInput" ref={passwordAgain} />
                        <button className="loginButton" type="submit">Sign Up</button>
                        <a href="/login"><button className="loginRegisterButton">Login with your account</button></a>   
                    </form>
                </div>
            </div>
        </div>
    )
}

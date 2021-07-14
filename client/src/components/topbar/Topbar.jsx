import "./topbar.css"
import { Search, Person, Chat, Notifications } from "@material-ui/icons"
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

function Topbar() {
    // const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${sessionStorage.getItem("userId")}`);
            setUser(res.data);
        }
        fetchUser();
    }, []);

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <span className="logo"><a style={{ textDecoration: "none", color: "white" }} href="/">Social</a></span>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input type="text" placeholder="Search something" className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">Homepage</span>
                    <span className="topbarLink">Timeline</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div>
                <a href={`/profile/${sessionStorage.getItem("userId")}`}>
                    <img src={user.profilePicture ? (PF + user.profilePicture) : (PF + "/person/noAvatar.png")} alt="" className="topbarImg" />
                </a>
            </div>
        </div>
    );
}

export default Topbar;
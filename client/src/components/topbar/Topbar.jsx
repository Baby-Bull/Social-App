import "./topbar.css"
import { Search, Person, Chat, Notifications } from "@material-ui/icons"
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

function Topbar() {

    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [inputSearch, setInputSearch] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("/users");
            setAllUsers(res.data);
        };
        fetchUsers();
    }, [])

    useEffect(() => {
        if (inputSearch.length > 0) {
            const result = allUsers.filter((u) => {
                return u.username.toLowerCase().match(inputSearch);
            });
            setSearchUsers(result);
        } else {
            setSearchUsers([]);
        }
    }, [inputSearch])


    return (
        <>
            <div className="topbarContainer">
                <div className="topbarLeft">
                    <span className="logo"><Link style={{ textDecoration: "none", color: "white" }} to="/">T-Social</Link></span>
                </div>
                <div className="topbarCenter">
                    <div className="searchbar">
                        <Search className="searchIcon" />
                        <input
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            type="text"
                            placeholder="Search something"
                            className="searchInput" />
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
                        <Link to="/messenger">
                            <div className="topbarIconItem">
                                <Chat />
                                <span className="topbarIconBadge">1</span>
                            </div>
                        </Link>
                        <div className="topbarIconItem">
                            <Notifications />
                            <span className="topbarIconBadge">1</span>
                        </div>
                    </div>
                    <Link to={`/profile/${sessionStorage.getItem("userId")}`}>
                        <img src={user.profilePicture ? (PF + user.profilePicture) : (PF + "/person/noAvatar.png")} alt="" className="topbarImg" />
                    </Link>
                </div>
            </div>
            <ul className="listSearch">
                {
                    searchUsers.map((us) => (
                        <Link style={{ textDecoration:"none" }} to={"/profile/" + us._id} >
                            <li onClick={() => setInputSearch("")} className="listSearchItem">
                                <div className="searchAvatar">
                                    <img
                                        className="searchImage"
                                        src={
                                            us.profilePicture ? PF + us.profilePicture : PF + "/person/noAvatar.png"
                                        }
                                        alt="" />
                                </div>
                                <div className="searchUsername">{us.username}</div>
                            </li>
                        </Link>
                    ))
                }
            </ul>
        </>
    );
}

export default Topbar;
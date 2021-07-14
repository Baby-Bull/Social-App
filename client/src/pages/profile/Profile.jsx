import "./profile.css"
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
 

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${window.location.pathname.split("/")[2]}`);
            setUser(res.data);
        }
        fetchUser();
    }, [])

    return (
        <div>
            <>
                <Topbar />
                <div className="profile">
                    <Sidebar />
                    <div className="profileRight">
                        <div className="profileRightTop">
                            <div className="profileCover">
                                <img src={PF + (user.coverPicture ? user.coverPicture : "/person/noCover.png")} alt="" className="profileCoverImg" />
                                <img src={PF + (user.profilePicture ? user.profilePicture : "/person/noAvatar.png")} alt="" className="profileUserImg" />
                            </div>
                            <div className="profileInfo">
                                <h4 className="profileInfoName">{user.username}</h4>
                                <span className="profileInfoDesc">{user.desc}</span>
                            </div>
                        </div>
                        <div className="profileRightBottom">
                            <Feed userId={window.location.pathname.split("/")[2]} />
                            <Rightbar user={user} />
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}

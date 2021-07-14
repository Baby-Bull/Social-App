import "./rightbar.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const [followed, setFollowed] = useState(false);
    const [friendsArray, setFriends] = useState([]);
    useEffect(() => {
        const fetchFriendsArray = async () => {
            const res = await axios.get(`/users/${sessionStorage.getItem("userId")}`);
            const array = [];
            for (let i = 0; i < res.data.followings.length; i++) {
                array.push((await axios.get(`/users/${res.data.followings[i]}`)).data)
            }
            setFollowed(res.data.followings.includes(window.location.pathname.split("/")[2]));
            setFriends(array);
        };
        fetchFriendsArray();
    }, []);

    const handleClick = async () => {
        try {
            (!followed) ? await axios.put(`/users/${window.location.pathname.split("/")[2]}/follow`, {
                userId: sessionStorage.getItem("userId")
            }) : await axios.put(`/users/${window.location.pathname.split("/")[2]}/unfollow`, {
                userId: sessionStorage.getItem("userId")
            })
        } catch (error) {
            console.log(error);
        }
        setFollowed(!followed);
    }


    const RightBarHome = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img src="/assets/gift.png" alt="" className="birthdayImg" />
                    <span className="birthdayText"><b>Beckham</b> and <b>3 others</b> have a birthday today</span>
                </div>
                <img src="/assets/ad.png" alt="" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {friendsArray.map((user) => {
                        return (
                            <li className="rightbarFriend">
                                <div className="rightbarProfileImgContainer">
                                    <img src={user.profilePicture ? (PF + user.profilePicture) : (PF + "/person/noAvatar.png")} alt="" className="rightbarProfileImg" />
                                    <span className="rightbarOnline"></span>
                                </div>
                                <span className="rightbarUserName">{user.username}</span>
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    };

    const RightbarProfile = () => {
        return (
            <>
                {(sessionStorage.getItem("userId") !== window.location.pathname.split("/")[2]) && (<button className="rightbarFollowButton" onClick={handleClick} > {(!followed ? `Follow` : "Unfollow")}
                    {(!followed ? <Add /> : <Remove />)}  </button>)}
                <h4 className="rightbarTitle">User Infomation</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">School:</span>
                        <span className="rightbarInfoValue">{user.school}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User Friends</h4>
                <div className="rightbarFollowings">
                    {
                        friendsArray.map((us) => {
                            return (
                                <div className="rightbarFollowing">
                                    <img src={us.profilePicture ? PF + us.profilePicture : PF + "/person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
                                    <span className="rightbarFollowingName">{us.username}</span>
                                </div>
                            )
                        })
                    }

                </div>
            </>
        )
    }


    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <RightbarProfile /> : <RightBarHome />}
            </div>
        </div>
    )
}

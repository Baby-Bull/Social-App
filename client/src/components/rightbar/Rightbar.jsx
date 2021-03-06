import "./rightbar.css"
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Button } from '@mui/material';
import { Add, Remove, Edit, Chat } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Rightbar(props) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const { user } = useContext(AuthContext);

    const [city, setCity] = useState(props.userparams?.city);
    const [from, setFrom] = useState(props.userparams?.from);
    const [relationship, setRelationship] = useState(props.userparams?.relationship);
    const [school, setSchool] = useState(props.userparams?.school);

    const [followed, setFollowed] = useState(false);
    const [friendsArray, setFriends] = useState([]);
    const [editMode, setEditMode] = useState(false);

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

    const handleUpdate = async () => {
        try {
            await axios.put("/users/" + user._id, {
                userId: user._id,
                city,
                school,
                relationship,
                from
            });
            setEditMode(false);
        } catch (error) {
            console.log(error);
        }
    }
    const handleChat = async () => {
        try {

        } catch (error) {

        }
    }

    const [trigger, setTrigger] = useState(false);
    const handleTrigger = () => {
        setTrigger(!trigger);
        props.callBack(trigger);
    }

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {props.userparams ?
                    (
                        <>
                            {
                                (user._id !== window.location.pathname.split("/")[2]) &&
                                (<div className="optionFollow">
                                    {/* <button className="rightbarFollowButton" onClick={handleClick} >
                                        {(!followed ? `Follow` : "Unfollow")}
                                        {(!followed ? <Add /> : <Remove />)}
                                    </button> */}
                                    <Button onClick={handleClick} variant="contained" endIcon={(!followed ? <Add /> : <Remove />)}>
                                        {(!followed ? `Follow` : "Unfollow")}
                                    </Button>
                                    <Link to={"/messenger?" + window.location.pathname.split("/")[2]} >
                                        <Button variant="contained" endIcon={<Chat />}>
                                            Messenger
                                        </Button>
                                    </Link>
                                </div>
                                )
                            }
                            {
                                (sessionStorage.getItem("userId") === window.location.pathname.split("/")[2]) &&
                                (<Edit onClick={() => setEditMode(true)} />)
                            }
                            <h4 className="rightbarTitle">User Infomation</h4>
                            {!editMode ?
                                (<div className="rightbarInfo">
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">City:</span>
                                        <span className="rightbarInfoValue">{props.userparams.city}</span>
                                    </div>
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">From:</span>
                                        <span className="rightbarInfoValue">{props.userparams.from}</span>
                                    </div>
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">Relationship:</span>
                                        <span className="rightbarInfoValue">{props.userparams.relationship}</span>
                                    </div>
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">School:</span>
                                        <span className="rightbarInfoValue">{props.userparams.school}</span>

                                    </div>
                                </div>)
                                :
                                (<form className="rightbarInfo">
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">City:</span>
                                        <input key={1} value={city} onChange={(e) => setCity(e.target.value)} type="text" className="rightbarInfoValue" />
                                    </div>
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">From:</span>
                                        <input value={from} key={2} onChange={(e) => setFrom(e.target.value)} type="text" className="rightbarInfoValue" />
                                    </div>
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">Relationship:</span>
                                        <input key={3} value={relationship} onChange={(e) => setRelationship(e.target.value)} type="text" className="rightbarInfoValue" />
                                    </div>
                                    <div className="rightbarInfoItem">
                                        <span className="rightbarInfoKey">School:</span>
                                        <input key={4} value={school} onChange={(e) => setSchool(e.target.value)} type="text" className="rightbarInfoValue" />
                                    </div>
                                    < button onClick={handleUpdate}>Update</button>
                                </form>)

                            }
                            <h4 className="rightbarTitle">User Friends</h4>
                            <div className="rightbarFollowings">
                                {
                                    friendsArray.map((us) => {
                                        return (
                                            <Link style={{ textDecoration: "none", color: "black" }} onClick={handleTrigger} to={`/profile/${us._id}`}>
                                                <div className="rightbarFollowing">
                                                    <img src={us.profilePicture ? us.profilePicture : PF + "/person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
                                                    <span className="rightbarFollowingName">{us.username}</span>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                    :
                    (
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
                                            <Link style={{ textDecoration: "none", color: "black" }} onClick={() => { console.log(user); }} to={`/profile/${user._id}`}>
                                                <div className="rightbarProfileImgContainer">
                                                    <img src={user.profilePicture ? (user.profilePicture) : (PF + "/person/noAvatar.png")} alt="" className="rightbarProfileImg" />
                                                    <span className="rightbarOnline"></span>
                                                </div>
                                                <span className="rightbarUserName">{user.username}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>
                    )}
            </div>
        </div >
    )
}

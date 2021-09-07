import React, { useEffect, useState } from 'react';
import "./chatOnline.css";
import axios from "axios";

export default function ChatOnline({ onlineUsers, currentId, setCurrentConversation }) {
    const PF = "http://localhost:8800/images/";
    const [friends, setFriends] = useState([]);
    const [onlineNow, setOnlineNow] = useState([]);
    const [offlineNow, setOfflineNow] = useState([]);


    useEffect(() => {
        const fetchFriends = async () => {
            const res = await axios.get("/users/" + currentId);
            setFriends(res.data.followings)
            onlineUsers?.map((ou) => {
                setFriends((res.data.followings).filter((temp) => (
                    temp !== ou
                )))
            });
        };
        fetchFriends();
    }, [onlineUsers, currentId]);

    useEffect(() => {
        const fetchFr = async () => {
            const online = [];
            const offline = [];
            for (let i = 0; i < onlineUsers.length; i++) {
                online.push((await axios.get(`/users/${onlineUsers[i]}`)).data)
            }
            for (let j = 0; j < friends.length; j++) {
                offline.push((await axios.get(`/users/${friends[j]}`)).data)
            }
            setOnlineNow(online);
            setOfflineNow(offline);
        };
        fetchFr();
    }, [onlineUsers, friends])

    const handleClick = async (user) => {
        const res = await axios.get("/conversations/find/" + currentId + "/" + user._id);

        res.data ?
            setCurrentConversation(res.data) :
            setCurrentConversation(
                await axios.post("/conversations", {
                    senderId: currentId,
                    receiverId: user._id
                }).data)
    }


    return (
        <div className="chatOnline">
            {onlineNow.map((ou) => (
                <div className="chatOnlineFriend" onClick={() => handleClick(ou)}>
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src={
                                ou?.profilePicture
                                    ? PF + ou.profilePicture
                                    : PF + "person/noAvatar.png"
                            }
                            alt=""
                        />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{ou.username}</span>
                </div>
            ))}
            {offlineNow.map((offu) => (
                <div className="chatOnlineFriend" onClick={() => handleClick(offu)}>
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src={
                                offu?.profilePicture
                                    ? PF + offu.profilePicture
                                    : PF + "person/noAvatar.png"
                            }
                            alt=""
                        />
                        {/* <div className="chatOnlineBadge"></div> */}
                    </div>
                    <span className="chatOnlineName">{offu.username}</span>
                </div>
            ))}
        </div>
    )
}

import React, { useContext, useEffect, useState } from 'react';
import "./message.css";
import { format } from "timeago.js";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

export default function Message({ message, own }) {
    const { user } = useContext(AuthContext);
    const [currentPatner, setCurrentPatner] = useState(null);

    useEffect(() => {
        const fetchCurrentPatner = async () => {
            const res = await axios.get("/users/" + message.sender);
            setCurrentPatner(res.data)
        }
        fetchCurrentPatner();
    }, [])

    const PF = "http://localhost:8800/images/";
    return (
        <div className={own ? "message own" : "message"} >
            <div className="messageTop">
                <img
                    className="messageImg"
                    src={own ? (user?.profilePicture ? user.profilePicture : PF + "person/noAvatar.png") : (currentPatner?.profilePicture ? currentPatner.profilePicture : PF + "person/noAvatar.png")}
                    alt=""
                />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}

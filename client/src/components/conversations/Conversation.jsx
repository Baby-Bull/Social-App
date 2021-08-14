import React, { useEffect, useState } from 'react';
import "./conversation.css";
import axios from "axios";

export default function Conversation({ conversation, currentUser }) {
    const PF = "http://localhost:8800/images/";
    const [user, setUser] = useState(null);

    const friendId = conversation.members.find((m) => (m !== currentUser._id));

    useEffect(() => {
        const fetchFriend = async () => {
            const res = await axios.get("/users/" + friendId);
            setUser(res.data);
        };
        fetchFriend();
    }, [currentUser, conversation]);


    return (
        <div className="conversation">
            {user &&
                (<>
                    <img
                        className="conversationImg"
                        src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
                        alt=""
                    />
                    <span className="conversationName">{user.username}</span>
                </>)
            }
        </div>
    )
}

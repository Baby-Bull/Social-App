import React, { useContext, useEffect, useRef, useState } from 'react';
import Topbar from '../../components/topbar/Topbar';
import Message from '../../components/message/Message';
import Conversation from '../../components/conversations/Conversation';
import "./messenger.css";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { io } from "socket.io-client";
import ChatOnline from '../../components/chatOnline/ChatOnline';

export default function Messenger() {
    const { user } = useContext(AuthContext);

    const searchId = window.location.search.substr(1, window.location.search.length + 1);
    console.log(searchId);

    useEffect(() => {
        const fetchInitialCon = async () => {
            if (searchId !== "") {
                const res = await axios.get("/conversations/find/" + searchId + "/" + user._id);
                res.data ?
                    setCurrentConversation(res.data) :
                    setCurrentConversation(
                        await axios.post("/conversations", {
                            senderId: searchId,
                            receiverId: user._id
                        }).data)
            }
        }
        fetchInitialCon();
    }, [searchId])


    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentConversation, setCurrentConversation] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);


    const socket = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", (data) => {
            setReceivedMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            });
        })
        //setSocket(io("ws://localhost:8900"));
    }, []);

    // set new Message after sendHandle
    useEffect(() => {
        receivedMessage && currentConversation?.members.includes(receivedMessage.sender) &&
            setMessages((prev) => [...prev, receivedMessage])
    }, [receivedMessage, currentConversation])

    //get onlineUsers from user.following list
    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(user.followings.filter((onFriend) => (
                users.some((temp) => temp.userId === onFriend)
            )));
        })
    }, [user]);

    // useEffect(() => {
    //     socket?.on("welcome", (message) => {
    //         console.log(message);
    //     })
    // }, [socket]);


    // get data conversations for the right chat menu
    useEffect(() => {
        const fetchConversations = async () => {
            const res = await axios("/conversations/" + user._id);
            setConversations(res.data);
        }
        fetchConversations();
    }, [user._id]);

    // get all messages of current conversation
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await axios.get("/messages/" + currentConversation?._id)
            setMessages(res.data);
        };
        fetchMessages();
    }, [currentConversation]);

    // handle click event send a new message
    const handleSend = async (e) => {
        e.preventDefault();
        const bodyRequest = {
            conversationId: currentConversation._id,
            sender: user._id,
            text: newMessage
        };

        const receiverId = currentConversation.members.find((member) => member !== user._id);

        socket.current.emit("sendMessage", {
            senderId: user._id,
            text: newMessage,
            receiverId,
        })

        const res = await axios.post("/messages", bodyRequest);
        setMessages([...messages, res.data]);
        setNewMessage("");
    };

    // auto scroll to the end of chat box whenever has a new message
    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentConversation(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentConversation ?
                            <>
                                <div className="chatBoxTop">
                                    {
                                        messages.map((message) => (
                                            <div ref={scrollRef}>
                                                <Message message={message} own={message.sender === user._id} />
                                            </div>
                                        ))
                                    }
                                </div>
                                <form onSubmit={handleSend} className="chatBoxBottom">
                                    <input
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    />
                                    <button type="submit" className="chatSubmitButton"  >
                                        Send
                                    </button>
                                </form>
                            </> :
                            <span className="noConversationText">
                                Open a conversation to start a chat.
                            </span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentConversation={setCurrentConversation} />
                    </div>
                </div>
            </div>
        </div>
    )
}


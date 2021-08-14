import { MoreVertRounded } from "@material-ui/icons"
import "./post.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Post({ post }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [like, setLike] = useState(post.like.length);
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${post.userId}`);
            setUser(res.data);
        }
        fetchUser();
    }, []); // get information user from post parameter
    useEffect(() => {
        setIsLiked(post.like.includes(sessionStorage.getItem("userId")));
    }, [post.like, sessionStorage.getItem("userId")]);// set like state

    const likeHandle = async () => {
        try {
            await axios.put(`/posts/${post._id}/like`, {
                userId: sessionStorage.getItem("userId")
            });
            setLike(isLiked ? like - 1 : like + 1);
            setIsLiked(!isLiked);
        } catch (error) {
            console.log(error);
        }
    };

    const [down, setDown] = useState("none");
    const clickToDown = () => {
        (down === "none") ? setDown("block") : setDown("none");
    }
    const [deleted, setDeleted] = useState("block");
    const clickToDelete = async () => {
        try {
            await axios.delete("/posts/" + post._id, {
                data: {
                    userId: sessionStorage.getItem("userId")
                }
            });
            setDeleted("none");
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="post" style={{ display: deleted }}>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user._id}`}>
                            <img src={PF + (user.profilePicture || "person/noAvatar.png")} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVertRounded onClick={clickToDown} />
                        <ul style={{ display: down }} className="postTopRightOptions">
                            <li className="postTopRightOption">Edit post</li>
                            <hr className="postTopRightOptionsHr" />
                            <li className="postTopRightOption" onClick={clickToDelete}>Delete post</li>
                        </ul>
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post.desc}</span>
                    <img src={PF + post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img onClick={likeHandle} className="likeIcon" src="/assets/like.png" alt="" />
                        <img onClick={likeHandle} className="likeIcon" src="/assets/heart.png" alt="" />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

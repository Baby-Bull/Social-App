import { useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";

export default function Feed({ userId }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = userId ? await axios.get("/posts/profile/" + userId) : await axios.get(`/posts/timeline/${sessionStorage.getItem("userId")}`);
            setPosts(res.data);
        }
        fetchPosts();
    }, []);

    return (
        <div className="feed">
            <div className="feedWrapper">
                <Share />
                {posts.map((p) => {
                    return (
                        <Post key={p._id} post={p} />
                    )
                })}
            </div>
        </div>
    )
}

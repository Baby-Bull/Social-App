import "./share.css"
import { PermMedia, Label, Room, EmojiEmotions, ScreenShareRounded, Cancel } from '@material-ui/icons'
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Share() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const content = useRef();
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${sessionStorage.getItem("userId")}`);
            setUser(res.data);
        }
        fetchUser();
    }, []);

    const submitHandle = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: content.current.value
        };
        if (file) {
            const data = new FormData();
            const fileName = (file.name);
            data.append("file", file);
            data.append("name", fileName);
            newPost.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (error) {
                console.log(error);
            }
        }
        try {
            await axios.post("/posts", newPost);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture ? (PF + user.profilePicture) : (PF + "/person/noAvatar.png")} alt="" />
                    <input type="text" placeholder={"What's in your mind " + user.username} className="shareInput" ref={content} />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgConttainer">
                        <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                        <input type="button" className="shareCancelImg" onClick={() => setFile(null)} value="X" />
                    </div>
                )}
                        <form className="shareBottom" onSubmit={submitHandle}>
                            <div className="shareOptions">
                                <label htmlFor="file" className="shareOption">
                                    <PermMedia htmlColor="tomato" className="shareIcon" />
                                    <span className="shareOptionText">Photos or videos</span>
                                    <input style={{ display: "none" }} type="file" accept=".jpg,.jpeg,.png" id="file" onChange={(e) => setFile(e.target.files[0])} />
                                </label>
                                <div className="shareOption">
                                    <Label htmlColor="green" className="shareIcon" />
                                    <span className="shareOptionText">Tags</span>
                                </div>
                                <div className="shareOption">
                                    <Room htmlColor="blue" className="shareIcon" />
                                    <span className="shareOptionText">Location</span>
                                </div>
                                <div className="shareOption">
                                    <EmojiEmotions htmlColor="yellow" className="shareIcon" />
                                    <span className="shareOptionText">Feeling</span>
                                </div>
                            </div>
                            <button type="submit" className="shareButton"><ScreenShareRounded className="shareButtonIcon" />Share</button>
                        </form>
                    </div>
        </div>
            )
}

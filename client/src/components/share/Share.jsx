import "./share.css"
import { PermMedia, Label, Room, EmojiEmotions, ScreenShareRounded, Cancel } from '@material-ui/icons'
import { useEffect, useState, useRef } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";

export default function Share() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const content = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${sessionStorage.getItem("userId")}`);
            setUser(res.data);
        }
        fetchUser();
    }, []);


    const [progress, setProgress] = useState(null);
    const [urlImage, setUrlImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const uploadFiles = (file) => {
        if (!file) return;
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
            (snapshot) => {
                const progressIndex = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log(progressIndex);
                setProgress(progressIndex);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setUrlImage(downloadURL)
                        console.log(downloadURL);
                    })
            }
        )
    }
    const updatePostImage = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setSelectedImage(file);
        uploadFiles(file)
    }
    const handleCancel = (e) => {
        e.preventDefault();
        setSelectedImage(null);
        setProgress(null);
        setUrlImage(null);
    }

    const submitHandle = async () => {
        const newPost = {
            userId: user._id,
            desc: content.current.value,
            img: urlImage
        };
        try {
            await axios.post("/posts", newPost);
            setSelectedImage(null);
            setProgress(null);
            setUrlImage(null);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture ? (user.profilePicture) : (PF + "/person/noAvatar.png")} alt="" />
                    <input type="text" placeholder={"What's in your mind " + user.username} className="shareInput" ref={content} />
                </div>
                <hr className="shareHr" />
                {selectedImage && (
                    <div className="shareImgConttainer">
                        <img src={URL.createObjectURL(selectedImage)} alt="" className="shareImg" />
                        <input type="button" className="shareCancelImg" onClick={handleCancel} value="X" />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandle}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photos or videos</span>
                            <input style={{ display: "none" }} type="file" accept=".jpg,.jpeg,.png" id="file" onChange={(e) => updatePostImage(e)} />
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
                    <button type="submit" className="shareButton">{(progress !== null || progress !== 100) ? <ScreenShareRounded className="shareButtonIcon" /> : <CircularProgress color="white" size="20px" />} &nbsp; Share</button>
                </form>
            </div>
        </div>
    )
}

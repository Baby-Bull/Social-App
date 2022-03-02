import "./profile.css"
import { styled } from '@mui/material/styles';
import { IconButton, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import PublicIcon from '@mui/icons-material/Public';
import CheckIcon from '@mui/icons-material/Check';
import { AuthContext } from "../../context/AuthContext";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/firebase";

import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";


export default function Profile() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const [trigger, setTrigger] = useState(false);
    const checkAuth = (user._id === window.location.pathname.split("/")[2]);
    // call back to rightbar
    const changeTrigger = (data) => {
        setTrigger(data);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${window.location.pathname.split("/")[2]}`);
            setUser(res.data);
        }
        fetchUser();
    }, [trigger, window.location.pathname.split("/")[2]])


    const [progress, setProgress] = useState(0);
    const [urlImage, setUrlImage] = useState();
    const [changeMode, setChangeMode] = useState("none");
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

    const setProfileImageWithMode = () => {
        if (changeMode === "profileMode") return URL.createObjectURL(selectedImage);
        else return user.profilePicture ? user.profilePicture : PF + "/person/noAvatar.png";
    }
    const setCoverImageWithMode = () => {
        if (changeMode === "coverMode") return URL.createObjectURL(selectedImage);
        else return user.coverPicture ? user.coverPicture : PF + "/person/noCover.png";
    }
    const updateProfileImage = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setSelectedImage(file);
        setChangeMode("profileMode");
        uploadFiles(file)
    }
    const updateCoverImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setSelectedImage(file);
        setChangeMode("coverMode");
        uploadFiles(file)
    }
    const handleSaveChange = async () => {
        await axios.put(`/users/${window.location.pathname.split("/")[2]}`,
            ((changeMode === "coverMode") ?
                {
                    "userId": window.location.pathname.split("/")[2],
                    "coverPicture": urlImage
                } :
                {
                    "userId": window.location.pathname.split("/")[2],
                    "profilePicture": urlImage
                }));
        setChangeMode("none");
        setProgress(0);
        setUrlImage(null);
        setSelectedImage(null);
        setTrigger(!trigger);
    }
    const handleCancel = () => {
        setChangeMode("none");
        setProgress(0);
        setUrlImage(null);
        setSelectedImage(null);
    }


    const Input = styled('input')({
        display: 'none',
    });
    return (
        <div>
            <>
                <Topbar />
                <div className="profile">
                    <Sidebar />
                    <div className="profileRight">
                        <div className="profileRightTop">
                            <div className="profileCover">
                                <img src={setCoverImageWithMode()} alt="" className="profileCoverImg" />
                                {checkAuth && <label style={{ float: "left", margin: "-3em 0px 3em 0px" }} htmlFor="icon-button-file1">
                                    <Input onChange={(e) => updateCoverImage(e)} accept="image/*" id="icon-button-file1" type="file" />
                                    <IconButton className="uploadPictureButton" color="primary" aria-label="upload picture" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>}
                                <img src={setProfileImageWithMode()} alt="" className="profileUserImg" />
                                {checkAuth && <label htmlFor="icon-button-file2">
                                    <Input onChange={(e) => updateProfileImage(e)} accept="image/*" id="icon-button-file2" type="file" />
                                    <IconButton className="uploadPictureButton" color="primary" aria-label="upload picture" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>}
                            </div>
                            <div className="profileInfo">
                                <h4 className="profileInfoName">{user.username}</h4>
                                <span className="profileInfoDesc">{user.desc}</span>
                            </div>
                        </div>
                        <div className="profileRightBottom">
                            <Feed userId={window.location.pathname.split("/")[2]} />
                            <Rightbar userparams={user} callBack={changeTrigger} />
                        </div>
                    </div>
                    {(changeMode !== "none") &&
                        <div className="changepanel">
                            <div>
                                <PublicIcon /><p>Your cover picture and avatar are public</p>
                            </div>
                            <br />
                            <Button onClick={handleCancel} variant="outlined" color="error">
                                Cancel
                            </Button>
                            &emsp;
                            <Button disabled={(progress !== 100)} onClick={handleSaveChange} variant="contained" color="primary">
                                Save &emsp;{(progress === 100) ? <CheckIcon color="white" size="20px" /> : <CircularProgress color="white" size="20px" />}
                            </Button>
                        </div>}
                </div>
            </>
        </div>
    )
}

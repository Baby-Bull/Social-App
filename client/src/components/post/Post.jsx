import { MoreVertRounded } from "@material-ui/icons"
import "./post.css"
import { Box, Divider, IconButton, MenuItem, Button, Menu, Collapse } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ImageIcon from '@mui/icons-material/Image';
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Post({ post }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);

    const [openCommentBlock, setOpenCommentBlock] = useState(false);
    const checkAuth = (user._id === window.location.pathname.split("/")[2]);

    const [trigger, setTrigger] = useState(false);
    const [comments, setComments] = useState([]);
    const [like, setLike] = useState(post.like.length);
    const [isLiked, setIsLiked] = useState(false);
    const [userPost, setUserPost] = useState({})
    const contentComment = useRef();

    useEffect(() => {
        const fetchUserandComment = async () => {
            const res1 = await axios.get(`/users/${post.userId}`);
            setUserPost(res1.data);
            const res2 = await axios.get(`/comments/${post._id}`);
            setComments(res2.data);
        }
        fetchUserandComment();
    }, [trigger]); // get information user from post parameter
    useEffect(() => {
        setIsLiked(post.like.includes(user._id));
    }, [post.like, user._id]);// set like state

    // like, dislike this post
    const likeHandle = async () => {
        try {
            await axios.put(`/posts/${post._id}/like`, {
                userId: user._id
            });
            setLike(isLiked ? like - 1 : like + 1);
            setIsLiked(!isLiked);
        } catch (error) {
            console.log(error);
        }
    };

    // open option this  post
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //delete a post
    const [deleted, setDeleted] = useState("block");
    const clickToDelete = async () => {
        try {
            await axios.delete("/posts/" + post._id, {
                data: {
                    userId: user._id
                }
            });
            setDeleted("none");
        } catch (error) {
            console.log(error);
        }
    }

    // comment this post
    const handleWriteComment = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/comments/", {
                userId: user._id,
                postId: post._id,
                content: contentComment.current.value
            })
            setTrigger(!trigger)
            contentComment.current.value = "";
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="post" style={{ display: deleted }}>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${userPost._id}`}>
                            <img src={(userPost.profilePicture || PF + "person/noAvatar.png")} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">{userPost.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <MoreVertRounded />
                            </IconButton>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {checkAuth && <>
                                <MenuItem>
                                    Edit this post
                                </MenuItem>
                                <MenuItem onClick={clickToDelete} sx={{ color: "red" }}>
                                    Delete this post
                                </MenuItem>
                                <Divider />
                            </>
                            }
                            {!checkAuth && <>
                                <MenuItem>
                                    Hide this user
                                </MenuItem>
                                <MenuItem>
                                    Report this post
                                </MenuItem>
                            </>
                            }
                        </Menu>
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
                        <span onClick={() => setOpenCommentBlock(!openCommentBlock)} className="postCommentText">{comments.length} comments</span>
                    </div>
                </div>

                <Collapse in={openCommentBlock}>
                    <div class="blog-comment">
                        <h3 class="text-success">Comments</h3>
                        <ul class="comments">
                            {comments.map((comment) => (
                                <li class="clearfix">
                                    <img src={comment.user.userProfilePicture} class="avatar" alt="" />
                                    <div class="post-comments">
                                        <p class="meta">{format(comment.createdAt)}&emsp;<a href="#">{comment.user.username}</a>
                                            <div className="likeComment">
                                                <ThumbUpIcon fontSize="small" /> {comment.like.length} &emsp; &emsp;
                                                <ThumbDownIcon fontSize="small" /> 0
                                            </div>
                                        </p>
                                        <p>{comment.content}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <form className="writeComment" onSubmit={handleWriteComment}>
                            <img className="avatarWriteComment" src={user.profilePicture} alt="" />
                            <input ref={contentComment} className="inputWriteComment" type="text" placeholder="write comment" />
                            <ImageIcon fontSize="small" />
                            <AttachFileIcon fontSize="small" />
                            <Button type="submit" size="small" sx={{ textTransform: "capitalize" }} variant="contained" endIcon={<SendIcon />}>
                                Send
                            </Button>
                        </form>
                    </div>
                </Collapse>

            </div>
        </div >
    )
}

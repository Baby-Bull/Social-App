import "./topbar.css"
import { Box, Avatar, Menu, MenuItem, ListItemIcon, IconButton, Divider, Typography, Tooltip, Autocomplete, TextField } from '@mui/material';
import { Search, Person, Chat, Notifications, Settings, PersonAdd } from "@material-ui/icons";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

function Topbar() {

    const { dispatch, user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("/users");
            setAllUsers(res.data);
        };
        fetchUsers();
    }, [])

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <>
            <div className="topbarContainer">
                <div className="topbarLeft">
                    <span className="logo"><Link style={{ textDecoration: "none", color: "white" }} to="/">T-Social</Link></span>
                </div>
                <div className="topbarCenter">
                    <Box className="searchBox">
                        <Search className="searchIcon" />
                        <Autocomplete
                            className="inputSearch"
                            sx={{ width: "100%" }}
                            freeSolo
                            getOptionLabel={(option) => option.username}
                            options={allUsers}
                            renderInput={(params) => <TextField {...params} />}
                            renderOption={(props, option) => (
                                <Link style={{ textDecoration: "none", color: "black" }} to={"/profile/" + option._id}>
                                    <Box {...props}>
                                        <Avatar src={option.profilePicture} />
                                        <Box ml={2}>{option.username}</Box>
                                    </Box>
                                </Link>
                            )}
                        />
                    </Box>
                </div>
                <div className="topbarRight">
                    <div className="topbarLinks">
                        <span className="topbarLink">Timeline</span>
                    </div>
                    <div className="topbarIcons">
                        <div className="topbarIconItem">
                            <Person />
                            <span className="topbarIconBadge">1</span>
                        </div>
                        <Link to="/messenger">
                            <div className="topbarIconItem">
                                <Chat />
                                <span className="topbarIconBadge">1</span>
                            </div>
                        </Link>
                        <div className="topbarIconItem">
                            <Notifications />
                            <span className="topbarIconBadge">1</span>
                        </div>
                    </div>

                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar className="topbarImg" src={user.profilePicture ? (user.profilePicture) : (PF + "/person/noAvatar.png")} sx={{ width: 32, height: 32 }} />
                            </IconButton>
                        </Tooltip>
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
                        <MenuItem>
                            <Link style={{ textDecoration: "none", display: "flex", color: "black" }} to={`/profile/${user._id}`}>
                                <Avatar /> Profile
                            </Link>
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            Add another account
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Link onClick={() => dispatch({ type: "LOGOUT" })} to="/login">
                            <MenuItem>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Link>
                    </Menu>
                </div>
            </div>
        </>
    );
}

export default Topbar;
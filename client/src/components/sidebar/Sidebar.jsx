import "./sidebar.css"
import { RssFeed, Chat, PlayCircleOutline, Group, Bookmarks, HelpOutline, WorkOutline, Event, School } from "@material-ui/icons"
import { Users } from "../../dummyData"

function Sidebar() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarItem">
                        <RssFeed className="sidebarIcon" />
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarItem">
                        <Chat className="sidebarIcon" />
                        <span className="sidebarListItemText">Chats</span>
                    </li>
                    <li className="sidebarItem">
                        <PlayCircleOutline className="sidebarIcon" />
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarItem">
                        <Group className="sidebarIcon" />
                        <span className="sidebarListItemText">Group</span>
                    </li>
                    <li className="sidebarItem">
                        <Bookmarks className="sidebarIcon" />
                        <span className="sidebarListItemText">Bookmarks</span>
                    </li>
                    <li className="sidebarItem">
                        <HelpOutline className="sidebarIcon" />
                        <span className="sidebarListItemText">Questions</span>
                    </li>
                    <li className="sidebarItem">
                        <WorkOutline className="sidebarIcon" />
                        <span className="sidebarListItemText">Jobs</span>
                    </li>
                    <li className="sidebarItem">
                        <Event className="sidebarIcon" />
                        <span className="sidebarListItemText">Events</span>
                    </li>
                    <li className="sidebarItem">
                        <School className="sidebarIcon" />
                        <span className="sidebarListItemText">Course</span>
                    </li>
                </ul>
                <button className="sidebarButton">Show more</button>
                <hr className="sidebarHr" />
                <ul className="sidebarFriendList">
                    {Users.map((user => {
                        return (
                            <li className="sidebarFriend">
                                <img src={PF + user.profilePicture} alt="" className="sidebarFriendImg" />
                                <span className="sidebarFriendName">{user.username}</span>
                            </li>
                        )
                    }))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
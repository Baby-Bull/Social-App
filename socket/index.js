const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// list of users in socket
let users = [];

// all function in socket
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};



io.on("connection", (socket) => {
    console.log("an user connected.");
    
    //take userId and socket from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get a message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text
        });
    });

    //when a user disconnect
    socket.on("disconnect", () => {
        console.log("an user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
});
const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
    {
        postId: {
            type: String
        },
        userId: {
            type: String
        },
        user: {
            userProfilePicture: {
                type: String
            },
            username: {
                type: String
            }
        },
        content: {
            type: String
        },
        like: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
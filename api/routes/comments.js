const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");

//create a new comment 
router.post("/", async (req, res) => {
    const newComment = new Comment(req.body);
    const userComment = await User.findById(req.body.userId);
    try {
        const tempUser = {
            userId: userComment._id,
            userProfilePicture: userComment.profilePicture,
            username: userComment.username,
        }
        newComment.user = tempUser;
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get comments
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
});

//like a comment
router.put("/:id/like", async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment.like.includes(req.body.userId)) {
            await comment.updateOne({ $push: { like: req.body.userId } });
            res.status(200).json("you liked this comment");
        } else {
            await comment.updateOne({ $pull: { like: req.body.userId } });
            res.status(200).json("you disliked this comment");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = router;
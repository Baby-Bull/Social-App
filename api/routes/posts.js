const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create a new post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json("create a post successful");
    } catch (error) {
        res.status(500).json(error);
    }
})

//update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("your post has been modified")
        } else {
            res.status(403).json("you can't modify this post")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("you delete this post successful")
        } else {
            res.status(403).json("you can't delete this post, it's not for you");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.like.includes(req.body.userId)) {
            await post.updateOne({ $push: { like: req.body.userId } });
            res.status(200).json("you liked this post");
        } else {
            await post.updateOne({ $pull: { like: req.body.userId } });
            res.status(200).json("you disliked this post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//get a post 
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get timeline post
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json((userPosts.reverse()).concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all user's posts
router.get("/profile/:userId", async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.params.userId });
        res.status(200).json(userPosts.reverse());
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;

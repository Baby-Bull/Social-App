const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user : put
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password);
            } catch (error) {
                res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been updated");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't modify here");
    }
});

//delete user : delete
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }
        catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't modify here");
    }
});

//get user: get
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, createdAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get all user 
router.get("/", async (req,res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})

// follower user: put []
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id); // someone in your list followers
            const currentUser = await User.findById(req.body.userId); // you

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed !")
            } else {
                res.status(403).json("you allready follow this user")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't folow yourself")
    }
});

// Unfollow user : put[]
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id); // someone in your list followers
            const currentUser = await User.findById(req.body.userId); // you

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed !")
            } else {
                res.status(403).json("you allready unfollow this user")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't unfolow yourself")
    }
});

module.exports = router;
const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Tweet, User, Comment, Retweet, Like, Follow } = require('../../db/models')
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();


//====== GET USERS THAT LOGGED USER FOLLOWS (FOLLOWS) ================//
router.get('/users/me', requireAuth, async (req, res, next) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        const follows = await Follow.findAll({
            where: {
                followerId: req.user.id
            },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'profileImage', 'username', 'bio', 'verified']
            }]
        })
        res.status(200)
        return res.json({
            LoggedUserFollowing: follows
        })
    } else {
        const err = new Error("Could not find the logged User.");
        err.message = "Could not find the logged User.";
        err.status = 401;
        return next(err);
    }
})

//=============== GET FOLOWERS ================//
router.get('/users/:userId/followers', requireAuth, async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (user) {
        const follows = await Follow.findAll({
            where: {
                followerId: userId
            },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'profileImage', 'username', 'bio', 'verified']
            }]
        })
        res.status(200)
        return res.json({
            Followers: follows
        })
    } else {
        const err = new Error("Could not find a User with the specified id.");
        err.message = "Could not find a User with the specified id.";
        err.status = 401;
        return next(err);
    }
})

//================= GET FOLLOWS ================//
router.get('/users/:userId/following', requireAuth, async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (user) {
        const follows = await Follow.findAll({
            where: {
                followerId: userId
            },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'profileImage', 'username', 'bio', 'verified']
            }]
        })
        res.status(200)
        return res.json({
            Following: follows
        })
    } else {
        const err = new Error("Could not find a User with the specified id.");
        err.message = "Could not find a User with the specified id.";
        err.status = 401;
        return next(err);
    }
})

//============= FOLLOW A USER (CREATE FOLLOW) ================//
router.post('/users/:userId/follow', requireAuth, async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByPk(userId)
    const existingFollow = await Follow.findOne({
        where: {
            userId: req.user.id,
            followerId: userId
        }
    })

    if (user) {
        if (existingFollow) {
            const err = new Error("Cannot follow a user twice.");
            err.message = "Cannot follow a user twice.";
            err.status = 404;
            return next(err);
        } else {
            const follow = await Follow.create({
                userId: req.user.id,
                followerId: userId
            })
            res.status(200)
            return res.json(follow)
        }
    } else {
        const err = new Error("Could not find a User with the specified id.");
        err.message = "Could not find a User with the specified id.";
        err.status = 401;
        return next(err);
    }

})

//============== UNFOLLOW A USER (DELETE FOLLOW) =============//
router.delete('/users/:userId/follows/:followId', requireAuth, async (req, res, next) => {
    const { userId, followId } = req.params;
    const user = await User.findByPk(userId)
    const existingFollow = await Follow.findByPk(followId)

    if (user) {
        if (existingFollow) {
            const follow = await existingFollow.destroy();
            res.status(200)
            return res.json(follow)
        } else {
            const err = new Error("Cannot unfollow a user you do not already follow.");
            err.message = "Cannot unfollow a user you do not already follow.";
            err.status = 404;
            return next(err);
        }
    } else {
        const err = new Error("Could not find a User with the specified id.");
        err.message = "Could not find a User with the specified id.";
        err.status = 404;
        return next(err);
    }
})

module.exports = router;

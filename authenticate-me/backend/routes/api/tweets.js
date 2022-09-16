const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Tweet, User, Comment, Retweet, Like, Follow } = require('../../db/models')
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { where } = require("sequelize");
const { get } = require("./users");
const router = express.Router();

//=======================================//
const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors
];

//==== FEED PAGE: GET ALL TWEETS FROM FOLLOWED USERS ONLY =====//
router.get('/feed', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    const followers = await Follow.findAll({
        where: {
            userId
        }
    })

    const tweets = []
    for (let i = 0; i < followers.length; i++) {
        let follower = followers[i]
        const tweet = await Tweet.findAll({
            where: {
                userId: follower.userId
            },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'profileImage', 'username', 'verified']
            }]
        })
        tweets.push(tweet)
    }

    const tweets2 = []
    for (let i = 0; i < tweets[0].length; i++) {
        let tweet = tweets[0][i];
        const comments = await Comment.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const retweets = await Retweet.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const likes = await Like.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        tweet.dataValues.commentCount = comments.count;
        tweet.dataValues.retweetCount = retweets.count;
        tweet.dataValues.likeCount = likes.count;
        tweets2.push(tweet)
    }

    res.status(200)
    return res.json({
        Tweets: tweets2
    })

})

//========== EXPLORER PAGE: GET ALL TWEETS ============//
router.get('/explore', requireAuth, async (req, res, next) => {
    const tweets = await Tweet.findAll({
        attributes: ['id', 'userId', 'tweet', 'image', 'gif', 'createdAt', 'updatedAt'],
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'profileImage', 'username', 'verified']
        }]


    })

    for (let i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];
        const comments = await Comment.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const retweets = await Retweet.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const likes = await Like.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        tweet.dataValues.commentCount = comments.count;
        tweet.dataValues.retweetCount = retweets.count;
        tweet.dataValues.likeCount = likes.count;
    }
    res.status(200)
    return res.json({
        Tweets: tweets
    })

})

//============== GET ALL TWEETS BY USER ID ===============//
router.get('/users/:userId', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const tweets = await Tweet.findAll({
        where: {
            userId
        }
    })

    for (let i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];
        const comments = await Comment.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const retweets = await Retweet.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const likes = await Like.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        tweet.dataValues.commentCount = comments.count;
        tweet.dataValues.retweetCount = retweets.count;
        tweet.dataValues.likeCount = likes.count;
    }

    res.status(200)
    return res.json({
        Tweet: tweets
    })
})

//=========== GET TWEET BY ID / GET ALL COMMENTS ============//
router.get('/:tweetId', async (req, res, next) => {
    const { tweetId } = req.params;
    const tweet = await Tweet.findOne({
        where: {
            id: tweetId
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'profileImage', 'username', 'verified']
        }, {
            model: Comment
        }]
    })

    if (tweet) {
        const comments = await Comment.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const retweets = await Retweet.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        const likes = await Like.findAndCountAll({
            where: {
                tweetId: tweet.id
            }
        })
        tweet.dataValues.commentCount = comments.count;
        tweet.dataValues.retweetCount = retweets.count;
        tweet.dataValues.likeCount = likes.count;

        res.status(200)
        res.json({
            Tweet: tweet
        })
    } else {
        const err = new Error("Tweet with that id does not exist.");
        err.message = "Tweet with that id does not exist.";
        err.status = 404;
        return next(err);
    }
})

module.exports = router;

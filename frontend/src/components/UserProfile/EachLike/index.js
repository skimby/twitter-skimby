import { createLikeBackend, getLikesBackend, deleteLikeBackend } from '../../../store/like'
import { getOneTweetBackend } from '../../../store/tweet';
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import { useRef } from 'react'

function EachLike({ tweetId, isOwnPage }) {
    const dispatch = useDispatch();
    const [liked, setLiked] = useState();
    const loggedUser = useSelector(state => state.session.user)
    const myLike = useRef()

    const tweet = useSelector(state => state.tweets.currentTweet)
    const newLikes = useSelector(state => state.likes)
    const likes = tweet?.likes
    console.log(tweetId)

    useEffect(() => {
        if (tweetId) {
            dispatch(getOneTweetBackend(tweetId))
        }
    }, [dispatch, tweetId, newLikes])


    useEffect(() => {
        if (likes) {
            const tweetIsLiked = tweet?.likes.find(like => like.userId === loggedUser?.id)
            myLike.current = tweetIsLiked;

            if (tweetIsLiked) {
                setLiked(true)
            } else {
                setLiked(false)
            }
            console.log(tweetId, liked)
        }

    }, [dispatch, likes])


    const handleLike = (e) => {
        e.preventDefault();
        dispatch(createLikeBackend(parseInt(tweetId), isOwnPage))
        setLiked(true)
    }

    const handleUnlike = (e) => {
        e.preventDefault();
        dispatch(deleteLikeBackend(parseInt(tweetId), parseInt(myLike?.current?.id), isOwnPage))
        dispatch(getLikesBackend(tweetId));
        setLiked(false)
    }

    return (
        <>
            {liked && (
                <>
                    <i onClick={handleUnlike} className="fa-solid fa-heart pink-icon"></i>

                    <p className="pink-p">{tweet?.likeCount}</p>
                </>
            )}

            {!liked && (
                <>
                    <i onClick={handleLike} className="fa-regular fa-heart gray-icon"></i>

                    <p className="gray-p">{tweet?.likeCount}</p>
                </>
            )}

        </>
    )
}
export default EachLike;

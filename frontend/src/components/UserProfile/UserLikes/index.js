import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useHistory, } from 'react-router-dom';
import { getLikedTweetsBackend } from '../../../store/tweet';
import CreateCommentModal from '../../CreateCommentModal';
import Retweets from '../../Retweet';
import Likes from '../../Likes';
import giphyTag from '../../../images/powered-by-giphy.png'

function UserLikes({ userId, isOwnPage }) {
    const dispatch = useDispatch();
    const history = useHistory();

    let tweets = useSelector(state => state.tweets)
    let likes = useSelector(state => state.likes)
    const retweets = useSelector(state => state.retweets)
    const [newComment] = useState(true)

    useEffect(() => {
        dispatch(getLikedTweetsBackend(userId, isOwnPage))
    }, [dispatch, userId, isOwnPage, likes, retweets])


    // allComments2.sort((a, b) => {
    //     return new Date(b.createdAt1) - new Date(a.createdAt1)
    // })
    return (
        <>
            {
                isOwnPage && (
                    <>
                        {tweets?.loggedUserLikedTweets && (
                            Object.values(tweets?.loggedUserLikedTweets).sort((a, b) => new Date(b.createdAt1) - new Date(a.createdAt1)).map((like, index) => {
                                return (
                                    <div className='tweet-container' key={index}>
                                        <div className='tweet-profile-img' onClick={() => { history.push(`/${like?.User?.username}/${like?.User?.id}`) }}>

                                            <img className='profile-img pointer' src={like?.User?.profileImage} alt='user profile' />
                                        </div>

                                        <div className='tweet-text-box'>
                                            <div className='tweet-user-header'>
                                                <div className='username-name-box'>
                                                    <h5 className='name-username pointer' onClick={() => { history.push(`/${like?.User?.username}/${like?.User?.id}`) }}>
                                                        {like?.User?.firstName}

                                                        {like?.User?.verified && (
                                                            <div className="verified-div2">
                                                                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png' className='verified-badge' alt='verified badge icon' />
                                                            </div>
                                                        )}
                                                        <span className='thin-styling'> @{like?.User?.username} · {like?.updatedAt?.[1]} {like?.updatedAt?.[2]}</span></h5>
                                                </div>
                                            </div>

                                            {/* <div className='settings-btn' >
                                        <TweetSettingsModal tweet={tweet} />
                                    </div> */}
                                            <div className='tweet-tweet-box'>
                                                <p className='pointer' onClick={() => { history.push(`/${like?.User?.username}/tweets/${like?.id}`) }}>
                                                    {like?.tweet}
                                                </p>
                                            </div>

                                            <div className='tweet-img-gif'>
                                                {like?.image !== null && (
                                                    <img className='img-gif' src={like?.image} alt='tweet attachment' />
                                                )}
                                                {like?.gif !== null && (
                                                    <>
                                                        <img className='img-gif' src={like?.gif} alt='tweet attachment gif' />
                                                        <img className="padding-top " src={giphyTag} width='110px' alt='gif provided by GIPHY' />
                                                    </>
                                                )}
                                            </div>

                                            <div className='tweet-icons-box'>

                                                <div className='tweet-icon'>
                                                    <CreateCommentModal commentCount={like?.commentCount} tweet={like} newComment={newComment} />
                                                </div>
                                                <div className='tweet-icon'>
                                                    <Retweets retweetCount={like?.retweetCount} tweet={like} />
                                                </div>
                                                <div className='tweet-icon'>
                                                    <Likes likeCount={like?.likeCount} tweet={like} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        )}
                    </>

                )
            }

            {
                !isOwnPage && (
                    <>
                        {tweets?.likedTweets && (
                            Object.values(tweets?.likedTweets).sort((a, b) => new Date(b.createdAt1) - new Date(a.createdAt1)).map((like, index) => {
                                return (
                                    <div className='tweet-container' key={index}>
                                        <div className='tweet-profile-img' onClick={() => { history.push(`/${like?.User?.username}/${like?.User?.id}`) }}>

                                            <img className='profile-img pointer' src={like?.User?.profileImage} alt='user profile' />
                                        </div>

                                        <div className='tweet-text-box'>
                                            <div className='tweet-user-header'>
                                                <div className='username-name-box'>
                                                    <h5 className='name-username pointer' onClick={() => { history.push(`/${like?.User?.username}/${like?.User?.id}`) }}>
                                                        {like?.User?.firstName}

                                                        {like?.User?.verified && (
                                                            <div className="verified-div2">
                                                                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png' className='verified-badge' alt='verified badge icon' />
                                                            </div>
                                                        )}
                                                        <span className='thin-styling'> @{like?.User?.username} · {like?.updatedAt?.[1]} {like?.updatedAt?.[2]}</span></h5>
                                                </div>
                                            </div>

                                            {/* <div className='settings-btn' >
                                        <TweetSettingsModal tweet={tweet} />
                                    </div> */}
                                            <div className='tweet-tweet-box'>
                                                <p className='pointer' onClick={() => { history.push(`/${like?.User?.username}/tweets/${like?.id}`) }}>
                                                    {like?.tweet}
                                                </p>
                                            </div>

                                            <div className='tweet-img-gif'>
                                                {like?.image !== null && (
                                                    <img className='img-gif' src={like?.image} alt='tweet attachment' />
                                                )}
                                                {like?.gif !== null && (
                                                    <>
                                                        <img className='img-gif' src={like?.gif} alt='tweet attachment gif' />
                                                        <img className="padding-top " src={giphyTag} width='110px' alt='gif provided by GIPHY' />
                                                    </>
                                                )}
                                            </div>

                                            <div className='tweet-icons-box'>

                                                <div className='tweet-icon'>
                                                    <CreateCommentModal commentCount={like?.commentCount} tweet={like} newComment={newComment} />
                                                </div>
                                                <div className='tweet-icon'>
                                                    <Retweets retweetCount={like?.retweetCount} tweet={like} />
                                                </div>
                                                <div className='tweet-icon'>
                                                    <Likes likeCount={like?.likeCount} tweet={like} />
                                                </div>
                                                {/* <i onClick={handleLike(tweet)} className="fa-regular fa-heart"></i>{tweet?.likeCount} */}

                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        )}
                    </>

                )
            }
        </>
    )
}

export default UserLikes;

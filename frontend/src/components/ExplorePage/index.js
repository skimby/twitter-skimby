import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import CreateTweet from '../CreateTweet';
import ExploreTweets from './ExploreTweets';
import { getFeedTweetsBackend } from '../../store/tweet'

import './HomePage.css'

function ExplorePage() {
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState();

    const sessionUser = useSelector(state => state.session);
    const tweets = useSelector(state => state.tweets)
    const likes = useSelector(state => state.likes)


    useEffect(() => {
        dispatch(getFeedTweetsBackend())
    }, [dispatch, likes, sessionUser])

    useEffect(() => {
        if (sessionUser?.user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    return (
        <>


            <div className='home-div'>
                <h2>Explore</h2>
            </div>

            <div>
                <CreateTweet />
            </div>

            <div>
                <ExploreTweets />
            </div>

        </>

    )
}

export default ExplorePage;

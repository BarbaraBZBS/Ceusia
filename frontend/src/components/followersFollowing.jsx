'use client';
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

export default function FollowersFollowing( { user } ) {
    const [ followers, setFollowers ] = useState( 0 );
    const [ following, setFollowing ] = useState( 0 );


    useEffect( () => {
        const getFollowers = async () => {
            const res = await axios.get( `/auth/user/${ user.id }/followers` );
            setFollowers( res.data.count );
        };
        const getFollowing = async () => {
            const res = await axios.get( `/auth/user/${ user.id }/following` );
            setFollowing( res.data.count );
        };
        getFollowers();
        getFollowing();
    }, [ user.id, followers, following ] )

    return (
        <>
            <p className='mb-3'>
                { followers === 1 ? <span>{ followers } follower </span> : <span>{ followers } followers </span> }
                /{ following === 1 ? <span> { following } following</span> : <span> { following } followings</span> }
            </p>
        </>
    )
}

'use client';
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

export default function FollowersFollowing( { user } ) {
    const [ followers, setFollowers ] = useState( 0 );
    const [ following, setFollowing ] = useState( 0 );

    const getFollowers = async () => {
        const res = await axios.get( `/auth/user/${ user.id }/followers` );
        setFollowers( res.data.count );
    };

    const getFollowing = async () => {
        const res = await axios.get( `/auth/user/${ user.id }/following` );
        setFollowing( res.data.count );
    };

    useEffect( () => {
        getFollowers();
        getFollowing();
    }, [ followers, following ] )

    return (
        <>
            { followers === 1 ? <p className='mb-3'> { followers } follower / { following } following</p>
                : <p className='mb-3'> { followers } followers / { following } following</p> }
        </>
    )
}

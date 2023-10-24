'use client';
import React, { useEffect } from 'react';
import axios from "@/utils/axios";

export default function HomeFollows( props ) {

    useEffect( () => {
        const getFollowers = async () => {
            const res = await axios.get( `/auth/user/${ props.session.user.user_id }/followers` );
            props.setAllFollowers( res.data.count );
        };
        const getFollowing = async () => {
            const res = await axios.get( `/auth/user/${ props.session.user.user_id }/following` );
            props.setAllFollowings( res.data.count );
        };
        getFollowers();
        getFollowing();
    }, [ props ] );

    return (
        <div className='w-full mb-3 flex flex-col leading-none justify-start text-appmauvedark'>
            { props.allFollowers === 1 ? <p title="my followers" className=''>{ props.allFollowers } follower </p>
                : <p title="my followers" className=''>{ props.allFollowers } followers </p> }
            { props.allFollowings === 1 ? <p title="my followings" className=''> { props.allFollowings } following</p>
                : <p title="my followings" className=''> { props.allFollowings } followings</p> }
        </div>
    )
}

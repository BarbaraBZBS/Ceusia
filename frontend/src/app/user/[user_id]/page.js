import React from 'react';
// import UserProfilePic from '@/components/userProfilePic';
import { getOUser } from '@/app/lib/users';
import UserProfileCard from '@/components/userProfileCard';


export default async function UserIdProfile( { params: { user_id } } ) {
    // console.log( 'user id?: ', user_id );
    const user = await getOUser( user_id );
    // console.log( 'user??: ', user );

    return (
        <UserProfileCard user={ user } />
    )
}

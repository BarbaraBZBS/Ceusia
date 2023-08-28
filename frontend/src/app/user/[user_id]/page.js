import React from 'react';
import apiCall from '../../../utils/axiosConfig'
import UserProfilePic from '@/components/userProfilePic';
import { getOUser } from '@/app/lib/users';


export default async function UserIdProfile( { params: { user_id } } ) {
    // console.log( 'params: ', params.user_id )
    console.log( 'user id?: ', user_id );
    const user = await getOUser( user_id );
    console.log( 'user??: ', user );

    return (
        <div className='userCard'>
            <div>
                <h1 className='text-clamp3 text-center uppercase pb-6'>
                    Viewing { user.username } profile
                </h1>
            </div>
            <div>
                { user.motto == '' || user.motto == null ? <p className='text-clamp8 pb-4'>{ user.username } has no motto</p> : <p className='text-clamp5 mb-3'>{ user.motto }</p> }
            </div>
            <>
                <UserProfilePic user={ user } />
            </>
            <div className='text-clamp8 flex flex-row pb-4'>
                <p className='mx-2'>Followers: ??</p>
                <p className='mx-2'>Following: ??</p>
            </div>
            <div>
                <button className='follow_btn uppercase'>Follow</button>
            </div>
        </div>
    )
}

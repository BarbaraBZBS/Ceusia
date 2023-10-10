import React, { Suspense } from 'react';
// import UserProfilePic from '@/components/userProfilePic';
import { getOUser } from '@/app/lib/users';
import UserProfileCard from '@/components/userProfileCard';
import Loading from '../loading';
import { PageWrap } from '@/app/fm-wrap';

export default async function UserIdProfile( { params: { user_id } } ) {
    // console.log( 'user id?: ', user_id );
    const user = await getOUser( user_id );
    // console.log( 'user??: ', user );

    return (
        <Suspense fallback={ <Loading /> } >
            <PageWrap>
                <UserProfileCard user={ user } />
            </PageWrap>
        </Suspense>
    )
}

import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import LoggedUser from '@/components/loggedUser';
import { getUser } from '../lib/users';
import { Suspense } from 'react';
import Loading from '../loading';

export default async function UserProfile() {
    const user = await getUser();
    // console.log( 'user: ', user );
    const session = await getServerSession( authOptions() );

    return (
        <>
            { session?.user && user ? (
                <div>
                    <Suspense fallback={ <Loading /> }>
                        <LoggedUser user={ user } />
                    </Suspense>
                </div>
            ) : (
                <p>Seems like you are not logged in</p>
            ) }
        </>
    )
}

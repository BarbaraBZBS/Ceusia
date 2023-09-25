import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import LoggedUser from '@/components/loggedUser';
import { getUser } from '../lib/users';
import { Suspense } from 'react';
import Loading from '../loading';
import { PageWrap } from '../fm-wrap';

export default async function UserProfile() {
    const user = await getUser();
    const session = await getServerSession( authOptions() );

    return (
        <>
            { session?.user && user ? (
                <div>
                    <Suspense fallback={ <Loading /> }>
                        <PageWrap>
                            <LoggedUser user={ user } />
                        </PageWrap>
                    </Suspense>
                </div>
            ) : (
                <p>Seems like you are not logged in</p>
            ) }
        </>
    )
}

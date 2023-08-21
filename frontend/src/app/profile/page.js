import apiCall from '../../utils/axiosConfig';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import LoggedUser from '@/components/loggedUser';

async function getUser() {
    const session = await getServerSession( authOptions );
    const res = await apiCall.get( `/auth/user/${ session.user.user_id }` )
    if ( session == null ) {
        window.location( '/' )
    }
    if ( !res.status ) {
        console.log( 'error axios: ', error );
        throw new Error( 'Failed to fetch data' );
    }
    const data = res.data;
    console.log( 'res data: ', data );
    return data;
}


export default async function UserProfile() {
    const user = await getUser();
    if ( user == null ) {
        window.location = '/'
    }
    // console.log( 'user: ', user );
    const session = await getServerSession( authOptions );

    return (
        <>
            { session?.user.user_id === user.id ? <div>
                <LoggedUser user={ user } session={ session } />
            </div> : <div>

            </div>
            }
        </>
    )
}

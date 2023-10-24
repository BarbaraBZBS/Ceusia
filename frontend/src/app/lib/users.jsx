import apiCall from '../../utils/axiosConfig';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

export async function getUser() {
    const session = await getServerSession( authOptions() );
    const res = await apiCall.get( `/auth/user/${ session.user.user_id }` );
    if ( !res?.status ) {
        console.log( 'error axios' );
        // throw new Error( 'Failed to fetch data' );
    };
    const data = res.data;
    // console.log( 'res data: ', data );
    return data;
};

export async function getOUser( person ) {
    // console.log( 'user found? : ', person );
    const res = await apiCall.get( `/auth/user/${ person }` );
    const data = res.data;
    // console.log( 'response get user data: ', data );
    return data;
};

export async function getAllUsers() {
    const resp = await apiCall.get( '/auth/users' );
    const data = resp.data;
    // console.log( 'resp get all users data: ', data );
    return data;
}
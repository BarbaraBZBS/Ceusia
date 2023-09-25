import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { logout } from "@/app/actions";

const ApiCall = () => {
    const defaultOptions = {
        baseURL: process.env.NEXT_PUBLIC_API + '/api',
        headers: { "Content-Type": "application/json" },
    };

    const instance = axios.create( defaultOptions );

    instance.interceptors.request.use(
        async ( request ) => {
            const session = await getServerSession( authOptions() );
            // console.log( 'session: axios config-- ', session )
            if ( session ) {
                request.headers.Authorization = `Bearer ${ session.user.token }`;
            }
            return request;
        } );

    instance.interceptors.response.use(
        async ( response ) => {
            return response;
        },
        async ( error ) => {
            if ( error.response ) {
                console.log( 'error axios config : ', error.response );
                console.log( 'error data name axios config : ', error.response.data.error.name )
                console.log( 'error status axios config : ', error.response.status )
            }
            if ( error.response?.status === 401 ) {
                await axios( {
                    method: 'post',
                    url: '/api/auth/signout',
                } );
                logout();
                redirect( '/' );
            }
            else {
                console.log( 'error axios config : ', error )
            }
            // throw new Error( error.message );
        },
    );

    return instance;
};

export default ApiCall();
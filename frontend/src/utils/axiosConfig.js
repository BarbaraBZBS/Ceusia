import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { apiLogout } from "@/app/lib/apiLogout";
import { redirect } from "next/navigation";


//replace bottom one for expired session and eventually refresh token ??
// const ApiCall = () => {
//     const instance = axios.create( {
//         baseURL: process.env.NEXT_PUBLIC_API + '/api',
//     } );

//     instance.interceptors.request.use(
//         async ( request ) => {
//             let lastSession = await getServerSession( authOptions() )
//             if ( lastSession == null || Date.now() > Date.parse( lastSession.expires ) ) {
//                 const session = await getServerSession( authOptions );
//                 lastSession = session;
//             }

//             if ( lastSession ) {
//                 request.headers.Authorization = `Bearer ${ lastSession.user.token }`;
//             }
//             else {
//                 request.headers.Authorization = undefined;
//             }
//             console.log( 'axios instance request: ', request.headers )
//             return request;
//         } );

//     instance.interceptors.response.use(
//         ( response ) => {
//             return response;
//         },
//         ( error ) => {
//             console.log( 'error: ', error );
//             throw new Error( error.message );
//         },
//     );

//     return instance;
// };

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
            else {
                console.log( 'error axios config : ', error )
            }

            // if ( error.response.status === 401 ) {
            //     await axios( {
            //         method: 'post',
            //         url: '/api/auth/signout',
            //     } )
            //     apiLogout()
            //     // redirect( '/' )
            // }
            // throw new Error( error.message );
        },
    );

    return instance;
};

export default ApiCall();
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';


const ApiCall = () => {
    const instance = axios.create( {
        baseURL: process.env.NEXT_PUBLIC_API + '/api',
    } );


    instance.interceptors.request.use(
        async ( request ) => {
            let lastSession = await getServerSession( authOptions )
            if ( lastSession == null || Date.now() > Date.parse( lastSession.expires ) ) {
                const session = await getServerSession( authOptions );
                lastSession = session;
            }

            if ( lastSession ) {
                request.headers.Authorization = `Bearer ${ lastSession.user.token }`;
            }
            else {
                request.headers.Authorization = undefined;
            }
            console.log( 'axios instance request: ', request.headers )
            return request;
        } );

    instance.interceptors.response.use(
        ( response ) => {
            return response;
        },
        ( error ) => {
            console.log( 'error: ', error );
            throw new Error( error.message );
        },
    );


    return instance;
};

// const ApiCall = () => {
//     const defaultOptions = {
//         baseURL: process.env.NEXT_PUBLIC_API + '/api',
//     };

//     const instance = axios.create( defaultOptions );

//     instance.interceptors.request.use(
//         async ( request ) => {
//             const session = await getServerSession( authOptions );
//             if ( session ) {
//                 request.headers.Authorization = `Bearer ${ session.user.token }`;
//             }
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

export default ApiCall();
'use client';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { axiosAuth } from "../axios";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
    const { data: session } = useSession();
    const refreshedToken = useRefreshToken()

    useEffect( () => {
        const requestIntercept = axiosAuth.interceptors.request.use( ( config ) => {
            if ( !config.headers[ "Authorization" ] ) {
                config.headers[ "Authorization" ] = `Bearer ${ session?.user.token }`;
            }
            return config;
        },
            ( error ) => Promise.reject( error )
        );

        const responseIntercept = axiosAuth.interceptors.response.use(
            ( response ) => response,
            async ( error ) => {
                const prevRequest = error.config;
                if ( error?.response?.status === 401 && !prevRequest.sent ) {
                    prevRequest.sent = true;
                    await refreshedToken();
                    prevRequest.headers[ "Authorization" ] = `Bearer ${ session?.user.token }`;
                    return axiosAuth( prevRequest );
                }
                else {
                    console.log( 'error axios auth config : ', error?.config )
                }
                return Promise.reject( error );
            }
        )
        return () => {
            axiosAuth.interceptors.request.eject( requestIntercept );
            axiosAuth.interceptors.response.eject( responseIntercept );
        };
    }, [ session, refreshedToken ] );

    return axiosAuth;
};


export default useAxiosAuth;
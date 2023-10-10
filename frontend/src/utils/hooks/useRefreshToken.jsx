'use client';
import { useSession } from "next-auth/react";
import axios from "../axios";

export const useRefreshToken = () => {
    const { data: session } = useSession();

    const refreshedToken = async () => {
        // console.log( 'session refresh : ', session?.user.refreshToken )
        const res = await axios.post( "/auth/refresh", {
            refreshToken: session?.user.refreshToken,
        } );

        if ( session ) session.user.token = res.data.token;
    };

    return refreshedToken;
};
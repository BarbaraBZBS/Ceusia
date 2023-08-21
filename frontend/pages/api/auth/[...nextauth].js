import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
    session: { maxAge: 3 * 24 * 60 * 60 * 1000, strategy: 'jwt' },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    providers: [
        CredentialsProvider( {
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize( credentials, req ) {
                // Add logic here to look up the user from the credentials supplied
                // const res = await fetch( "http://localhost:8000/api/auth/login", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //         withCredentials: true
                //     },
                //     body: JSON.stringify( {
                //         email: credentials?.email,
                //         password: credentials?.password,
                //     } ),
                // } );
                // const user = await res.json();

                // if ( user.is_success ) {
                //     console.log( 'ok user' )
                //     // Any object returned will be saved in `user` property of the JWT
                //     return user
                // } else {
                //     // If you return null then an error will be displayed advising the user to check their details.
                //     return null

                //     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                // }

                return axios( {
                    method: 'post',
                    url: `${ process.env.NEXT_PUBLIC_API }/api/auth/login`,
                    data: {
                        email: credentials.email,
                        password: credentials.password,
                    },
                    withCredentials: true
                } )
                    .then( ( response ) => {
                        console.log( 'res data: ', response.data )
                        return response.data;
                    } )
                    .catch( ( error ) => {
                        console.log( error.response );
                        throw new Error( error.response.data.message );
                    } ) || null;
            },
        } ),
        // AppleProvider( {
        //     clientId: process.env.APPLE_ID,
        //     clientSecret: process.env.APPLE_SECRET
        // } ),
        // GoogleProvider( {
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // } ),
    ],

    callbacks: {
        async jwt( { token, user } ) {
            return { ...token, ...user }
        },

        async session( { session, token, user } ) {
            session.user = token;
            return session
        }
    },
    pages: {
        signIn: "/auth/signIn"
    }
};

export default NextAuth( authOptions );
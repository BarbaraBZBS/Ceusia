import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
    session: { maxAge: 3 * 60 * 60, strategy: 'jwt' },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 3000
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
    ],

    callbacks: {
        async jwt( { token, user, trigger, session } ) {
            if ( token.tokenExpiration < Date.now() ) {
                const user = await axios( {
                    method: 'post',
                    url: 'http://localhost:8000/api/auth/refresh',
                    data: token.refreshToken
                } )
                return { ...token, ...user }
            }
            if ( trigger === "update" && session ) {
                console.log( 'updated sess: ', { token, user, session } )
                return { ...token, ...user, ...session?.user }
            }
            console.log( 'jwt callback', { token, user, session } )
            // return { ...token } // token
            return { ...token, ...user }
        },

        async session( { session, token, user } ) {
            session.user = token;
            console.log( 'session callback: ', { session, token, user } )
            return session
        }
    },
    pages: {
        signIn: "/auth/signIn"
    }
};

export default NextAuth( authOptions );
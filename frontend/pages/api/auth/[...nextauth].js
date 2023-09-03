import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = ( req, res ) => {
    return {
        session: { maxAge: 1 * 60 * 60, strategy: 'jwt' }, //5 * 60 * 60
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
                async authorize( credentials ) {
                    try {
                        const response = await axios( {
                            method: 'post',
                            url: `${ process.env.NEXT_PUBLIC_API }/api/auth/login`,
                            data: {
                                email: credentials.email,
                                password: credentials.password,
                            },
                            withCredentials: true
                        } )

                        const cookies = response.headers[ 'set-cookie' ]

                        res.setHeader( 'Set-Cookie', cookies )

                        console.log( 'res data: ', response.data )
                        return response.data
                    }
                    catch ( error ) {
                        console.log( 'msg : ', error.response.data.message );
                        throw new Error( error.response.data.message );
                    }
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
                    console.log( 'refreshed : ', token )
                    return { ...token, ...user }
                }
                if ( trigger === "update" && session ) {
                    console.log( 'updated sess: ', { token, user, session } )
                    return { ...token, ...user, ...session?.user }
                }
                console.log( 'jwt callback', { token, user, session } )
                return { ...token, ...user }
            },

            async session( { session, token, user } ) {
                session.user = token;
                // console.log( 'session callback: ', { session, token, user } )
                return session
            }
        },
        pages: {
            signIn: "/auth/signIn",
            error: '/auth/signIn'
        }
    }
};

export default ( req, res ) => {
    return NextAuth( req, res, authOptions( req, res ) )
}

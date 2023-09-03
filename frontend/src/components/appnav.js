'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function AppNav() {
    const { data: session } = useSession();
    const currentRoute = usePathname();
    console.log( 'nav session: ', { session } );
    // console.log( 'expired? : ', session?.expires )
    if ( Date.now() > Date.parse( session?.expires ) ) {
        signOut( {
            callbackUrl: '/auth/signIn'
        } )
    }
    const signout = () => {
        signOut( {
            callbackUrl: '/auth/signIn'
        } );
    }

    return (
        <div className="mb-5 text-clamp5 bg-gray-200 bg-opacity-60">
            <header className="flex flex-row justify-between">
                <div>
                    <Link href="/">
                        <Image className="inline object-cover rounded-br-2xl"
                            src="/images/logo.png"
                            alt="ceusia main logo"
                            width={ 176 }
                            height={ 66 }
                            unoptimized={ true }
                            priority
                            placeholder="empty"
                        />
                    </Link>
                </div>
                <nav className="flex flex-col justify-center mx-2.5 text-center">
                    { session?.user ? (
                        <div className="flex flex-col">
                            <div>
                                <Link href="/profile" className="text-appmauvelight drop-shadow-lighter">{ session.user.username }</Link>
                            </div>
                            <div>
                                <button onClick={ signout } className="signLink linkAnim">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="linkAnim signLink">
                                <Link href='/auth/signIn' className={ currentRoute === '/auth/signIn' ? 'signLink activeLink' : 'signLink' }>
                                    Sign In
                                </Link>
                            </div>
                            <div className="linkAnim signLink">
                                <Link href="/auth/register" className={ currentRoute === '/auth/register' ? 'activeLink signLink' : 'signLink' }>
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    ) }
                </nav>
            </header>
        </div>
    );
};
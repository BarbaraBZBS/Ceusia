'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AppNav() {
    const { data: session, update } = useSession();
    const currentRoute = usePathname();
    const router = useRouter()
    console.log( 'nav session: ', { session } );

    // if ( session == null ) {
    //     signOut()
    // }

    const signout = () => {
        router.push( '/' )
        signOut()
    }

    return (
        <div className="mb-5 text-clamp5 bg-gray-200 bg-opacity-60">
            <header className="flex flex-row justify-between">
                <div>
                    <Link href="/">
                        <Image className="w-44 h-full object-cover rounded-br-2xl"
                            src="/images/logo.png"
                            alt="ceusia main logo"
                            width={ 0 }
                            height={ 0 }
                            unoptimized={ true }
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
                            <div>
                                <button onClick={ () => signIn() } className={ currentRoute === '/auth/signIn' ? 'signLink activeLink linkAnim' : 'signLink linkAnim' }>
                                    Sign In
                                </button>
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
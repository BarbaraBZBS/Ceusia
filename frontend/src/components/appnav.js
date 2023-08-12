"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AppNav() {
    const { data: session } = useSession();
    console.log( { session } );
    const currentRoute = usePathname()

    return (
        <div className="mb-5 text-clamp5 bg-gray-200 bg-opacity-60">
            <header className="flex flex-row justify-between">
                <div>
                    <Link href="/">
                        <Image className="w-44 h-full object-cover rounded-br-2xl"
                            src="/images/logo.png"
                            alt="ceusia main logo"
                            width={ 170 }
                            height={ 0 }
                        />
                    </Link>
                </div>
                <nav className="flex flex-col justify-center mx-2.5 text-center">
                    { session?.user ? (
                        <div>
                            <p className="text-appmauvelight drop-shadow-lighter">{ session.user.username }</p>
                            <button onClick={ () => signOut() } className="signLink linkAnim">
                                Sign Out
                            </button>
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
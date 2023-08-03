"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AppNav() {
    const { data: session } = useSession();
    console.log( { session } );

    return (
        <div>
            <header className="flex flex-row justify-between">
                <div>
                    <Link href="/">
                        <Image
                            src="/images/logo.png"
                            alt="ceusia Logo"
                            width={ 180 }
                            height={ 37 }
                        />
                    </Link>
                </div>
                <nav>
                    { session?.user ? (
                        <>
                            <p>{ session.user.username }</p>
                            <button onClick={ () => signOut() }>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <div>
                                <button onClick={ () => signIn() }>
                                    Sign In
                                </button>
                            </div>
                            <div>
                                <Link href="/auth/register">
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
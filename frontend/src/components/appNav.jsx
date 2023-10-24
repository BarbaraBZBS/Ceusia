'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/app/actions";

export default function AppNav() {
    const { data: session, status } = useSession();
    const currentRoute = usePathname();
    // console.log( 'nav session: ', { session } );
    // console.log( 'expired? : ', session?.expires )
    useEffect( () => {
        // if ( !session ) return;
        if ( session && status !== 'loading' ) {
            if ( Date.now() >= Date.parse( session?.expires ) ) {
                logout();
                signOut( {
                    callbackUrl: '/auth/signIn'
                } );
            }
        }
        else if ( status !== 'loading' && ( !session || session == undefined ) ) {
            // if ( currentRoute !== '/auth/signIn' && currentRoute !== '/' && status !== 'loading' && !session ) {
            if ( currentRoute === '/' || currentRoute === '/auth/signIn' || currentRoute === '/auth/register' ) {
                return
            }
            else {
                logout();
                signOut( {
                    callbackUrl: '/'
                } );
            }
        };
    }, [ session, currentRoute, status ] );

    return (
        <div className="mb-2 text-clamp5 bg-gray-200 bg-opacity-60">
            <header className="flex flex-row justify-between">
                <div>
                    <Link href="/" as={ '/' }>
                        <Image className="inline object-cover rounded-br-2xl"
                            src="/images/logo.png"
                            alt="ceusia main logo"
                            width={ 176 }
                            height={ 66 }
                            priority
                            placeholder="empty"
                            style={ { width: '176px', height: '66px' } }
                        />
                    </Link>
                </div>
                <nav className="flex flex-col justify-center mx-2.5 text-center">
                    { session?.user ? (
                        <div className="flex flex-col">
                            <div>
                                { session?.user.role === 'admin' ? <Link href="/profile" as={ '/profile' }
                                    className={ currentRoute === '/profile' ? "text-red-700 drop-shadow-lighter" : "text-appred drop-shadow-lighter hover:text-appmauvelight active:text-appturq" }> { session?.user.username }
                                </Link>
                                    : <Link href="/profile" as={ '/profile' }
                                        className={ currentRoute === '/profile' ? "text-appmagenta drop-shadow-lighter" : "text-appmauvedark drop-shadow-lighter hover:text-appmauvelight active:text-appturq" }>{ session?.user.username }
                                    </Link> }
                            </div>
                            <div>
                                <button onClick={ () => signOut( { callbackUrl: '/auth/signIn' } ) }
                                    className="hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out linkAnim">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="linkAnim hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out">
                                <Link href='/auth/signIn' as={ '/auth/signIn' }
                                    className={ currentRoute === '/auth/signIn' ? 'hover:text-appturq hover:translate-y-1 active:text-appturq active:underline transition-all duration-200 ease-in-out text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase' : 'hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out' }>
                                    Sign In
                                </Link>
                            </div>
                            <div className="linkAnim hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out">
                                <Link href="/auth/register" as={ '/auth/register' }
                                    className={ currentRoute === '/auth/register' ? 'text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase hover:text-appturq hover:translate-y-1 active:text-appturq active:underline transition-all duration-200 ease-in-out' : 'hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out' }>
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
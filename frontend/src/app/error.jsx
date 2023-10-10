'use client';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { logout } from './actions';

export default function Error( { error, reset } ) {
    const router = useRouter();

    useEffect( () => {
        console.error( error );
    }, [ error ] );

    const logOut = async () => {
        router.push( '/' );
        logout();
        signOut( {
            callbackUrl: '/auth/signIn'
        } );
    };

    return (
        <div className='h-fit pt-10 pb-28 my-16 flex flex-col items-center'>
            <h2 className='text-clamp3'>Something went wrong !</h2>
            <p className='text-clamp4 mt-4'>Reload page or sign back in</p>
            {/* <p>{ error.message }</p> */ }
            <button className='bg-appstone text-white uppercase w-fit rounded-xl px-3 py-[3px] mt-8 mb-4 transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:text-white hover:translate-y-[-7px] hover:shadow-btnindigo'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    // () => reset()
                    () => window.location.reload()
                }
            >
                Reload
            </button>
            <p>or</p>
            <button className='bg-appstone text-white uppercase w-fit rounded-xl px-3 py-[3px] mt-8 mb-4 transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:text-white hover:translate-y-[-7px] hover:shadow-btnindigo'
                onClick={
                    () => logOut()
                }
            >
                Sign Out
            </button>
        </div>
    )
}

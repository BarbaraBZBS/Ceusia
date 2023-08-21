'use client';
import { useEffect } from 'react';

export default function Error( { error, reset } ) {

    useEffect( () => {
        console.error( error );
    }, [ error ] )

    return (
        <div className='h-fit pt-10 pb-28 my-16 flex flex-col items-center'>
            <h2 className='text-clamp3'>Something went wrong !</h2>
            <p className='text-clamp4 mt-4'>Reload or try again later</p>
            {/* <p>{ error.message }</p> */ }
            <button className='errBtn'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Reload
            </button>
        </div>
    )
}

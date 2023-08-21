'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error( { error, reset } ) {
    const router = useRouter()
    // useEffect( () => {
    //     console.error( error )
    // }, [ error ] )

    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>{ error[ 0 ] }</p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    // () => reset()
                    router.refresh()
                }
            >
                Try again
            </button>
        </div>
    )
}

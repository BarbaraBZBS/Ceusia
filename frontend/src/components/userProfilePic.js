'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function UserProfilePic( { user } ) {
    const [ isPicZoomed, setIsPicZoomed ] = useState( false );


    const handlePicZoom = () => {
        setIsPicZoomed( !isPicZoomed );
    }

    return (
        <>
            <div className={ isPicZoomed ? 'flex justify-center items-center w-[88%] h-[400px] relative mb-5' : 'flex justify-center items-center w-[140px] h-[140px] relative mb-5' } onClick={ handlePicZoom }>
                <Image width={ 0 } height={ 0 } unoptimized={ true } src={ user.picture } alt={ `${ user.username } picture` } placeholder='data:image/...' className={ isPicZoomed ? 'profileUserPicZoom' : 'profileUserPic' } />
            </div>
        </>
    )
}

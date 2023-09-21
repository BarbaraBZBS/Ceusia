'use client';
import React, { useState, useEffect } from 'react';
import UserProfilePic from './userProfilePic';
import Loading from './loading';

export default function UserProfileCard( { user } ) {
    const [ isLoading, setIsLoading ] = useState( true );
    const [ followEffect, setFollowEffect ] = useState( false );

    useEffect( () => {
        if ( user ) {
            setIsLoading( false )
        }
    } );

    const handleFollow = () => {
        setFollowEffect( true );


    };

    return (
        <>
            { isLoading ? <Loading /> :
                <div className='userCard'>
                    <div>
                        <h1 className='text-clamp3 text-center uppercase pb-6'>
                            Viewing { user.username } profile
                        </h1>
                    </div>
                    <div>
                        { user.motto == '' || user.motto == null ? <p className='text-clamp8 pb-4'>{ user.username } has no motto</p> : <p className='text-clamp5 mb-3'>{ user.motto }</p> }
                    </div>
                    <>
                        <UserProfilePic user={ user } />
                    </>
                    <div className='text-clamp8 flex flex-row pb-4'>
                        <p className='mx-2'>Followers: ??</p>
                        <p className='mx-2'>Following: ??</p>
                    </div>
                    <div>
                        <button onClick={ () => handleFollow() } onAnimationEnd={ () => setFollowEffect( false ) } className={ `follow_btn uppercase ${ followEffect && 'animate-btnFlat' }` }>Follow</button>
                    </div>
                </div>
            }
        </>
    )
}

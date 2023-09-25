'use client';
import React, { useState, useEffect } from 'react';
import Loading from './loading';
import Image from 'next/image';

export default function UserProfileCard( { user } ) {
    const [ isLoading, setIsLoading ] = useState( true );
    const [ followEffect, setFollowEffect ] = useState( false );
    const [ unfollowEffect, setUnfollowEffect ] = useState( false );



    const [ isPicZoomed, setIsPicZoomed ] = useState( false );
    const isBrowser = () => typeof window !== 'undefined';

    function showUsrPicZoomOverlay() {
        setIsPicZoomed( true );
        const scrollY = document.documentElement.style.getPropertyValue(
            "--scroll-y"
        );
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${ scrollY }`;
    };
    function hideUsrPicZoomOverlay() {
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = "";
        body.style.top = "";
        if ( !isBrowser() ) return;
        window.scrollTo( 0, parseInt( scrollY || "0" ) * -1 );
        setIsPicZoomed( false );
    };

    if ( !isBrowser() ) return;
    window.addEventListener( "scroll", () => {
        document.documentElement.style.setProperty(
            "--scroll-y",
            `${ window.scrollY }px`
        );
    } );






    useEffect( () => {
        if ( user ) {
            setIsLoading( false )
        }
    } );

    const handleFollow = () => {
        setFollowEffect( true );


    };
    const handleUnfollow = () => {
        setUnfollowEffect( true );


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
                    <div className='profileUserPicContainer' onClick={ () => showUsrPicZoomOverlay() }>
                        <Image width={ 0 } height={ 0 } unoptimized={ true } src={ user.picture } alt={ `${ user.username } picture` } placeholder='data:image/...' className='profileUserPic' />
                    </div>
                    <div className={ isPicZoomed ? 'usrZoomedPicOverlay' : 'hidden' } onClick={ () => hideUsrPicZoomOverlay() }>
                        { isPicZoomed && <img src={ user.picture } alt={ `${ user.username } picture` } className='profileUserPicZoom animate-resizeZoom' /> }
                    </div>

                    <div>
                        {/* {followed ? <p></p> : <p></p> } */ }
                    </div>

                    <div className='text-clamp8 flex flex-row pb-4'>
                        <p className='mx-2'>Followers: ??</p>
                        <p className='mx-2'>Following: ??</p>
                    </div>

                    {/* {!followed && */ }
                    <div>
                        <button onClick={ () => handleFollow() } onAnimationEnd={ () => setFollowEffect( false ) } className={ `follow_btn uppercase ${ followEffect && 'animate-btnFlat' }` }>Follow</button>
                    </div>
                    {/* } */ }
                    {/* {followed && */ }
                    {/* <div> */ }
                    {/* <button onClick={ () => handleUnfollow() } onAnimationEnd={ () => setUnfollowEffect( false ) } className={ `follow_btn uppercase ${ unfollowEffect && 'animate-btnFlat' }` }>Follow</button> */ }
                    {/* </div> */ }
                    {/* } */ }
                </div>
            }
        </>
    )
}

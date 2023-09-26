'use client';
import React, { useState, useEffect } from 'react';
import Loading from './loading';
import Image from 'next/image';
import axios from '@/utils/axios';
import { useSession } from 'next-auth/react';

export default function UserProfileCard( { user } ) {
    const { data: session } = useSession();
    const [ isLoading, setIsLoading ] = useState( true );
    const [ isPicZoomed, setIsPicZoomed ] = useState( false );
    const isBrowser = () => typeof window !== 'undefined';
    const [ followed, setFollowed ] = useState( false );
    const [ followingUsr, setFollowingUsr ] = useState( false );
    const [ followEffect, setFollowEffect ] = useState( false );
    const [ unfollowEffect, setUnfollowEffect ] = useState( false );
    const [ followers, setFollowers ] = useState( 0 );
    const [ following, setFollowing ] = useState( 0 );
    const [ errMsg, setErrMsg ] = useState( false );

    useEffect( () => {
        if ( user ) {
            setIsLoading( false )
        }
    } );

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

    const getFollowers = async () => {
        const res = await axios.get( `/auth/user/${ user.id }/followers` );
        setFollowers( res.data.count );
    };

    const getFollowing = async () => {
        const res = await axios.get( `/auth/user/${ user.id }/following` );
        setFollowing( res.data.count );
    };

    useEffect( () => {
        getFollowers();
        getFollowing();
    }, [ followers, following, followed, followingUsr ] )

    const checkFollowedStatus = async () => {
        const data = {
            user_id: user.id,
            follower_id: session.user.user_id
        };
        const res = await axios( {
            method: 'post',
            url: '/auth/followstatus',
            data: data
        } );
        const status = res.data.message;
        console.log( 'res foll status : ', status );
        if ( status === 'followed' ) setFollowed( true );
    };

    const checkFollowingStatus = async () => {
        const data = {
            user_id: session.user.user_id,
            follower_id: user.id
        };
        const res = await axios( {
            method: 'post',
            url: '/auth/followstatus',
            data: data
        } );
        const status = res.data.message;
        console.log( 'res foll status : ', status );
        if ( status === 'followed' ) setFollowingUsr( true );
    };

    useEffect( () => {
        checkFollowedStatus();
        checkFollowingStatus();
    }, [ followed, followingUsr ] );

    const handleFollow = async () => {
        setFollowEffect( true );
        const data = {
            follower_id: session.user.user_id
        };
        try {
            await axios( {
                method: 'post',
                url: `/auth/follow/${ user.id }`,
                data: data
            } );
            setFollowed( true );
        }
        catch ( err ) {
            if ( !err?.response ) {
                console.log( err )
                setErrMsg( 'No response.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 )
            }
            else {
                console.log( err )
                setErrMsg( 'Following failed.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 )
            }
        }
    };

    const handleUnfollow = async () => {
        setUnfollowEffect( true );
        const data = {
            follower_id: session.user.user_id
        };
        try {
            await axios( {
                method: 'post',
                url: `/auth/unfollow/${ user.id }`,
                data: data
            } );
            setFollowed( false );
        }
        catch ( err ) {
            if ( !err?.response ) {
                console.log( err )
                setErrMsg( 'No response.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 )
            }
            else {
                console.log( err )
                setErrMsg( 'Unfollowing failed.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 )
            }
        }
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

                    { followed ? <div>
                        <p className='text-clamp8 pb-1 text-appmauvedark'> You are following { user.username }.</p>
                    </div> : <div className='hidden'></div>
                    }
                    { followingUsr ? <div>
                        <p className='text-clamp8 pb-4 text-appmagenta'> { user.username } is following you.</p>
                    </div> : <div className='hidden'></div>
                    }

                    <div>
                        { user.motto == '' || user.motto == null ? <p className='text-clamp8 pb-4'>{ user.username } has no motto</p> : <p className='text-clamp5 mb-3'>{ user.motto }</p> }
                    </div>
                    <div className='profileUserPicContainer' onClick={ () => showUsrPicZoomOverlay() }>
                        <Image width={ 0 } height={ 0 } unoptimized={ true } src={ user.picture } alt={ `${ user.username } picture` } placeholder='data:image/...' className='profileUserPic' />
                    </div>
                    <div className={ isPicZoomed ? 'usrZoomedPicOverlay' : 'hidden' } onClick={ () => hideUsrPicZoomOverlay() }>
                        { isPicZoomed && <img src={ user.picture } alt={ `${ user.username } picture` } className='profileUserPicZoom animate-resizeZoom' /> }
                    </div>

                    <div className='text-clamp8 flex pb-4'>
                        { followers === 1 ? <p className='mb-3'> { followers } follower / { following } following</p>
                            : <p className='mb-3'> { followers } followers / { following } following</p> }
                    </div>


                    { followed ?
                        <div>
                            <button onClick={ () => handleUnfollow() } onAnimationEnd={ () => setUnfollowEffect( false ) } className={ `follow_btn uppercase ${ unfollowEffect && 'animate-btnFlat' }` }>Unfollow</button>
                        </div>
                        :
                        <div>
                            <button onClick={ () => handleFollow() } onAnimationEnd={ () => setFollowEffect( false ) } className={ `follow_btn uppercase ${ followEffect && 'animate-btnFlat' }` }>Follow</button>
                        </div>
                    }
                    <p className={ errMsg ? 'errMsg text-clamp6 mx-0 my-2' : 'hidden' } aria-live="assertive">{ errMsg }</p>
                </div>
            }
        </>
    )
}

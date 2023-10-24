'use client';
import React, { useState, useEffect } from 'react';
import Loading from './loading';
import Image from 'next/image';
import axios from '@/utils/axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { faLeftLong, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import CeusianDetailsModifier from './ceusianDetailsModifier';

export default function UserProfileCard( { user } ) {
    const { data: session } = useSession();
    const router = useRouter();
    const [ isLoading, setIsLoading ] = useState( true );
    const [ isPicZoomed, setIsPicZoomed ] = useState( false );
    const isBrowser = () => typeof window !== 'undefined';
    const [ followed, setFollowed ] = useState( false );
    const [ followingUsr, setFollowingUsr ] = useState( false );
    const [ followEffect, setFollowEffect ] = useState( false );
    const [ unfollowEffect, setUnfollowEffect ] = useState( false );
    const [ backBtnEffect, setBackBtnEffect ] = useState( false );
    const [ followers, setFollowers ] = useState( 0 );
    const [ following, setFollowing ] = useState( 0 );
    const [ errMsg, setErrMsg ] = useState( false );
    const searchparam = useSearchParams();
    const postId = searchparam.get( 'pi' );
    const [ usr, setUsr ] = useState( user );

    useEffect( () => {
        if ( usr ) {
            setIsLoading( false )
        }
    }, [ usr ] );

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

    useEffect( () => {
        const getFollowers = async () => {
            const res = await axios.get( `/auth/user/${ user.id }/followers` );
            setFollowers( res.data.count );
        };
        const getFollowing = async () => {
            const res = await axios.get( `/auth/user/${ user.id }/following` );
            setFollowing( res.data.count );
        };
        getFollowers();
        getFollowing();
    }, [ user.id, followers, following, followed, followingUsr ] )


    useEffect( () => {
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
            // console.log( 'res foll status : ', status );
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
            // console.log( 'res foll status : ', status );
            if ( status === 'followed' ) setFollowingUsr( true );
        };
        checkFollowedStatus();
        checkFollowingStatus();
    }, [ session?.user.user_id, user.id, followed, followingUsr ] );

    const handleFollow = () => {
        setFollowEffect( true );
        const data = {
            follower_id: session.user.user_id
        };
        setTimeout( async () => {
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
        }, 700 );
    };

    const handleUnfollow = () => {
        setUnfollowEffect( true );
        const data = {
            follower_id: session.user.user_id
        };
        setTimeout( async () => {
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
        }, 700 );
    };

    const backToPost = ( link ) => {
        setBackBtnEffect( true );
        setTimeout( () => {
            if ( postId ) {
                router.replace( link )
            } else {
                router.back()
            }
        }, 500 );
    };

    if ( !isBrowser() ) return;
    window.addEventListener( "scroll", () => {
        document.documentElement.style.setProperty(
            "--scroll-y",
            `${ window.scrollY }px`
        );
    } );

    return (
        <>
            { isLoading ? <Loading /> :
                <>
                    <div className='flex flex-col justify-center items-center pt-8 pb-10 mt-10 mb-14 min-h-[400px] border-gray-900 bg-apppastgreen bg-opacity-30 rounded-lg shadow-lg w-[90%] mx-auto'>
                        <div>
                            <h1 className='text-clamp3 text-center uppercase pb-4'>
                                Viewing { usr.username } profile
                            </h1>
                        </div>

                        <div>
                            { usr.motto == '' || usr.motto == null ? <p className='text-clamp8 pb-4'>{ usr.username } has no motto</p> : <p className='text-clamp5 mb-3'>{ `"${ usr.motto }"` }</p> }
                        </div>
                        <div className='flex justify-center items-center w-[140px] h-[140px] rounded-full relative mb-5 transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light' onClick={ () => showUsrPicZoomOverlay() }>
                            <Image title={ `zoom ${ usr.username } picture` } width={ 0 } height={ 0 } priority src={ usr.picture } alt={ `${ usr.username } picture` } placeholder="empty" className='rounded-full object-cover w-full h-full cursor-pointer' />
                        </div>
                        <div className={ isPicZoomed ? 'fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] flex' : 'hidden' } onClick={ () => hideUsrPicZoomOverlay() }>
                            { isPicZoomed && <Image width={ 0 } height={ 0 } priority placeholder='empty' src={ usr.picture } alt={ `${ usr.username } picture` } className='block m-auto w-[96%] aspect-square object-cover rounded-full animate-resizeZoom' /> }
                        </div>

                        { followed ? <div>
                            <p className='text-clamp8 pt-1 text-appmauvedark'> You are following { usr.username }.</p>
                        </div> : <div className='text-clamp8 pt-1 text-gray-400'> You don&apos;t follow { usr.username }.</div>
                        }
                        { followingUsr ? <div>
                            <p className='text-clamp8 pb-3 text-appmagenta'> { usr.username } is following you.</p>
                        </div> : <div className='text-clamp8 pb-3 text-gray-400'>{ usr.username } does not follow you.</div>
                        }
                        <div className='text-clamp8 flex pb-4'>
                            { followers === 1 ? <p className='mb-3'> { followers } follower / { following } following</p>
                                : <p className='mb-3'> { followers } followers / { following } following</p> }
                        </div>

                        <div className='flex w-[80%] items-center justify-evenly'>
                            <div>
                                <button title={ postId ? 'back to the post' : 'back to previous page' } onClick={ () => backToPost( `/#${ postId }` ) } onAnimationEnd={ () => setBackBtnEffect( false ) }
                                    className={ `bg-[#FF7900] text-appblck w-fit rounded-xl py-1 mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange m-0 px-[10.5px] ${ backBtnEffect && 'animate-pressDown bg-apppastgreen' }` }>
                                    <FontAwesomeIcon icon={ faLeftLong } size='lg' />
                                </button>
                            </div>
                            { followed ?
                                <div className=''><button title='unfollow user' onClick={ () => handleUnfollow() } onAnimationEnd={ () => setUnfollowEffect( false ) }
                                    className={ `bg-appstone text-clamp6 text-white w-[41px] h-[31px] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:border-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue ${ unfollowEffect && 'animate-btnFlat text-appblck bg-apppastgreen' }` }>
                                    <FontAwesomeIcon icon={ faUserMinus } size='lg' />
                                </button></div>
                                : <div><button title='follow user' onClick={ () => handleFollow() } onAnimationEnd={ () => setFollowEffect( false ) }
                                    className={ `bg-appstone text-clamp6 text-white w-[41px] h-[31px] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:border-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue ${ followEffect && 'animate-btnFlat text-appblck bg-apppastgreen' }` }>
                                    <FontAwesomeIcon icon={ faUserPlus } size='lg' />
                                </button></div>
                            }
                        </div>
                        <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light rounded-md w-fit px-2 text-clamp6 mx-0 my-2' : 'hidden' } aria-live="assertive">{ errMsg }</p>

                    </div>

                    { session?.user.role === 'admin' ? <div className='mb-10'>
                        <CeusianDetailsModifier user={ user } current={ usr } setuser={ setUsr } seterr={ setErrMsg } />
                    </div> : <div></div> }
                </>
            }
        </>
    )
}

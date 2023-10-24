'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrendingCards( props ) {
    const router = useRouter();
    const [ trending, setTrending ] = useState( [] );
    const [ usrLinkEffect, setUsrLinkEffect ] = useState( false );
    const [ clickedBtn, setClickedBtn ] = useState( 0 );
    const [ goToPostEffect, setGoToPostEffect ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const [ showTrendingEffect, setShowTrendingEffect ] = useState( false );
    const [ hideTrendingEffect, setHideTrendingEffect ] = useState( false );

    useEffect( () => {
        if ( props.posts?.length > 0 ) {
            const postsArray = Object.keys( props.posts ).map( ( post ) => props.posts[ post ] );
            let sortedPosts = postsArray.sort( ( a, b ) => {
                return b.likes - a.likes;
            } )
            // console.log( 'sorted posts : ', sortedPosts )
            sortedPosts.length = 3
            setTrending( sortedPosts )
        }
    }, [ props.posts ] )

    const usrProfileLnk = ( link ) => {
        setUsrLinkEffect( true );
        setTimeout( () => {
            router.push( link )
        }, 500 );
    };

    const goToPost = ( link ) => {
        setGoToPostEffect( true );
        setTimeout( () => {
            router.push( link )
        }, 700 );
    };

    const showTrend = async () => {
        setShowTrendingEffect( true );
        props.setMeetShown( false );
        setTimeout( () => {
            props.setTrendShown( true );
        }, 500 );
    };

    const hideTrend = async () => {
        setHideTrendingEffect( true );
        setTimeout( () => {
            props.setTrendShown( false );
        }, 500 );
    };

    return (
        <>
            { props.trendShown ?
                <button title='hide trending' className={ `absolute right-[-3px] bg-apppastgreen border-2 border-apppastgreen rounded-tl-lg rounded-bl-lg pl-2 pr-[10px] hover:text-appmauvedark ${ hideTrendingEffect && 'animate-slideRight' }` }
                    onClick={ () => hideTrend() } onAnimationEnd={ () => setHideTrendingEffect( false ) }>
                    <FontAwesomeIcon icon={ faChevronRight } />
                </button>
                :
                <button title='show trending' className={ `absolute right-[-7px] bg-apppastgreen border-2 border-apppastgreen rounded-tl-lg rounded-bl-lg pl-2 pr-[10px] hover:text-appmagenta ${ showTrendingEffect && 'animate-slideLeft' }` }
                    onClick={ () => showTrend() } onAnimationEnd={ () => setShowTrendingEffect( false ) }>
                    <FontAwesomeIcon icon={ faChevronLeft } />
                    <span className='text-clamp2 ml-1'>Trending</span>
                </button>
            }
            <AnimatePresence>
                { props.trendShown && (
                    <motion.div
                        key="trend-cards"
                        initial={ { opacity: 0, x: "100vw" } }
                        animate={ { opacity: 1, x: 0 } }
                        exit={ { opacity: 0, x: "100vw" } }
                        transition={ { duration: 0.6, origin: 1 } }
                        className={ `border-2 bg-apppastgreen p-2 rounded-lg mt-16 ${ props.trendShown && 'flex flex-col' } ${ !props.trendShown && 'hidden' }` }>
                        <h2 className='text-center uppercase text-clamp5 mb-6'>Trending</h2>
                        { trending.map( ( post, index ) => (
                            <div key={ post.id } id={ post.id } className='w-full h-full'>
                                <div key={ post.id } className={ `bg-white m-auto border-2 rounded-lg shadow-md my-2 relative` }>
                                    <div className='flex text-clamp6 mx-3 mt-1 mb-[3px] touch-auto'>
                                        <div className='flex items-end'>
                                            {/* onclick link to user[user_id] params */ }
                                            { props.session?.user.user_id === post.user_id ? <p className='mb-[5px]'>You</p> :
                                                <button className={ `mb-[5px] hover:text-appturq active:text-appturq ${ clickedBtn === index && usrLinkEffect && 'animate-resizeBtn' }` }
                                                    onClick={ () => { setClickedBtn( index ); usrProfileLnk( `/csian/${ [ post.user_id ] }?pi=${ post.id }` ) } }
                                                    onAnimationEnd={ () => setUsrLinkEffect( false ) }
                                                >{ post.user.username }</button> }
                                        </div>
                                    </div>
                                    <div className='flex mx-3 items-center'>
                                        { post.fileUrl && post.fileUrl?.includes( 'image' ) && <div className='flex w-[90px] min-w-[90px] aspect-square touch-auto'>
                                            <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-xl object-cover object-top w-full h-full' src={ post.fileUrl } alt="post image" />
                                        </div> }
                                        { post.fileUrl && post.fileUrl?.includes( 'video' ) && <div className='flex w-[90px] min-w-[90px] aspect-square'>
                                            <video id={ post.id } width="100%" height="100%" controls style={ { borderRadius: '12px' } }>
                                                <source src={ post.fileUrl } type={ 'video/mp4' } />
                                                <source src={ post.fileUrl } type="video/ogg" />
                                                <source src={ post.fileUrl } type="video/webM" />
                                                Your browser does not support HTML5 video. </video>
                                        </div> }
                                        { !post.fileUrl || post.fileUrl?.includes( 'audio' ) && <div className='flex w-[90px] min-w-[90px] aspect-square touch-auto'>
                                            <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-xl object-cover object-top w-full h-full' src={ post.user.picture } alt={ `${ post.user.username } picture` } />
                                        </div> }
                                        { post.fileUrl == null && <div className='flex w-[90px] min-w-[90px] aspect-square touch-auto'>
                                            <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-xl object-cover object-top w-full h-full' src={ post.user.picture } alt={ `${ post.user.username } picture` } />
                                        </div> }
                                        <div className='flex flex-col ml-3'>
                                            { post.title ? <div className=''><h2 className='text-clamp7 line-clamp-1 font-medium mx-3'>{ post.title }</h2></div> : <div></div> }
                                            <div className='' onClick={ () => { setClickedBtn( index ); goToPost( `/coms/${ [ post.id ] }` ) } }>
                                                <p className='cursor-pointer line-clamp-2 text-clamp1 mx-3 mt-2 mb-3'>{ post.content }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={ `flex justify-end mx-3 text-clamp5 text-violet-700 hover:opacity-50 ${ clickedBtn === index && goToPostEffect && 'animate-btnFlat' }` }>
                                        <button onClick={ () => { setClickedBtn( index ); goToPost( `/coms/${ [ post.id ] }` ) } }>Read more...</button>
                                    </div>
                                    <div>
                                        <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
                                    </div>
                                </div>
                            </div>
                        ) ) }
                    </motion.div>
                ) }
            </AnimatePresence>
        </>
    )
}

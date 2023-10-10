'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PostLiking from './postLiking';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import LinkVideo from './linkVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare, faComments, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/navigation';
import { PageWrap } from '@/app/fm-wrap';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment/moment';
import PostAdd from './postAdd';

export default function Cards( { posts, session, params, searchParams } ) {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [ loadPost, setLoadPost ] = useState( true );
    const displayedCount = JSON.parse( sessionStorage?.getItem( 'postCount' ) ) || 5;
    const [ count, setCount ] = useState( displayedCount );
    const [ display, setDisplay ] = useState();
    const [ postImgZoom, setPostImgZoom ] = useState( false );
    const [ userPicZoom, setUserPicZoom ] = useState( false );
    const [ usrLinkEffect, setUsrLinkEffect ] = useState( false );
    const [ clickedBtn, setClickedBtn ] = useState( 0 );
    const [ modifyBtnEffect, setModifyBtnEffect ] = useState( false );
    const [ deleteBtnEffect, setDeleteBtnEffect ] = useState( false );
    const [ commentEffect, setCommentEffect ] = useState( false );
    const [ shareEffect, setShareEffect ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const isBrowser = () => typeof window !== 'undefined';
    const foundHash = window.location.hash;

    useEffect( () => {
        const body = document.body;
        body.style.position = "";
        body.style.top = "";
    }, [] );

    const dateParser = ( num ) => {
        let options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }
        let timestamp = Date.parse( num );
        let date = new Date( timestamp ).toLocaleDateString( 'en-US', options );
        return date.toString();
    };
    const dateParser2 = ( num ) => {
        const timeAgo = moment( num ).fromNow()
        return timeAgo
    };

    const modifBtn = ( link ) => {
        setModifyBtnEffect( true );
        setTimeout( () => {
            router.push( link, { scroll: true } )
        }, 500 );
    };
    const handleDelete = async ( postid ) => {
        setDeleteBtnEffect( true );
        setErrMsg( '' );
        setTimeout( async () => {
            try {
                let answer = window.confirm( 'Are you sure you want to delete this post?' );
                if ( answer ) {
                    const res = await axiosAuth.delete( `/posts/${ postid }` )
                    console.log( 'deleted ? : ', res )
                    if ( !res ) {
                        setErrMsg( 'Something went wrong, post was not removed' );
                        if ( !isBrowser() ) return;
                        window.scrollTo( { top: 0, behavior: 'smooth' } );
                    }
                    else {
                        const resp = await axiosAuth.get( '/posts' )
                        setDisplay( resp.data.slice( 0, count ) )
                    };
                }
            }
            catch ( err ) {
                console.log( 'delete post err : ', err )
                setErrMsg( 'Something went wrong, post was not removed' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }, 800 );
    };

    useEffect( () => {
        if ( !isBrowser() ) return;
        setTimeout( () => {
            if ( foundHash ) {
                let targetid = foundHash.replace( /.*\#/, "" );
                const target = document.getElementById( targetid );
                console.log( 'target : ', target )
                if ( target ) {
                    target.scrollIntoView( {
                        behavior: "smooth",
                        block: "start",
                        inline: "nearest",
                    } )
                }
            }
        }, 500 );
    }, [ foundHash ] );

    useEffect( () => {
        const loadMore = () => {
            if ( !isBrowser() ) return;
            if ( window.innerHeight + document.documentElement.scrollTop + 1 >
                document.scrollingElement.scrollHeight - 250 ) {
                setLoadPost( true )
            }
        };

        if ( loadPost ) {
            const newPostLoad = async () => {
                const resp = await axiosAuth.get( '/posts' )
                setLoadPost( false )
                setCount( count + 5 )
                setDisplay( resp.data.slice( 0, count ) )
                if ( !isBrowser() ) return;
                sessionStorage.setItem( 'postCount', JSON.stringify( count ) )
            }
            newPostLoad()
        }
        if ( !isBrowser() ) return;
        window.addEventListener( 'scroll', loadMore )
        return () => window.removeEventListener( 'scroll', loadMore )
    }, [ axiosAuth, loadPost, display, count ] );

    const usrProfileLnk = ( link ) => {
        setUsrLinkEffect( true );
        setTimeout( () => {
            router.push( link )
        }, 500 );
    };

    const handleComment = ( link ) => {
        setCommentEffect( true );
        setTimeout( () => {
            router.push( link )
        }, 500 );
    };

    const handleShare = () => {
        setShareEffect( true );


    };

    // handle overlays function
    function showOverlay() {
        const scrollY = document.documentElement.style.getPropertyValue(
            "--scroll-y"
        );
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${ scrollY }`;
    };
    function hideOverlay() {
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = "";
        body.style.top = "";
        if ( !isBrowser() ) return;
        window.scrollTo( 0, parseInt( scrollY || "0" ) * -1 );
    };
    // user picture zoom
    function showUsrPicZoomOverlay() {
        setUserPicZoom( true );
        showOverlay();
    };
    function hideUsrPicZoomOverlay() {
        hideOverlay();
        setUserPicZoom( false );
    };
    // post image zoom
    function showPostImgZoomOverlay() {
        setPostImgZoom( true );
        showOverlay();
    };
    function hidePostImgZoomOverlay() {
        hideOverlay();
        setPostImgZoom( false );
    };

    if ( !isBrowser() ) return;
    window.addEventListener( "scroll", () => {
        document.documentElement.style.setProperty(
            "--scroll-y",
            `${ window.scrollY }px`
        );
    } );

    return (
        <PageWrap>
            <div className='flex flex-col items-center'>
                <div className='mt-8 mb-4 flex flex-col items-center w-[331.2px]'>
                    {/* post form */ }
                    <h2 className='text-clamp7 font-medium'>What&apos;s on your mind?</h2>
                    <PostAdd setPosts={ setDisplay } numb={ count } />
                </div>

                {/* All Posts */ }
                { display?.map( ( post, index, params ) => (
                    <div key={ post.id } id={ post.id } className='w-full h-full'>
                        <AnimatePresence>
                            <motion.div
                                key={ post.id }
                                animate={ { opacity: [ 0, 1 ], y: [ 40, 0 ] } }
                                transition={ { duration: 0.6, delay: 0.3 } }
                                className={ ` m-auto border-2 rounded-lg shadow-md my-2 relative w-[90%] ${ userPicZoom && 'w-full' }  ` }>

                                { clickedBtn === index && userPicZoom && <div className='fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block' onClick={ () => hideUsrPicZoomOverlay() }>
                                    <Image width={ 0 } height={ 0 } priority placeholder="empty" src={ post.user.picture } alt={ `${ post.user.username } picture` } className='block m-auto w-[96%] h-auto object-cover my-12 rounded-lg animate-rotateZoom' />
                                </div> }
                                { clickedBtn === index && postImgZoom && <div className='fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block' onClick={ () => hidePostImgZoomOverlay() }>
                                    <Image width={ 0 } height={ 0 } priority placeholder="empty" src={ post.fileUrl } alt="post image" className='block m-auto w-[96%] h-auto object-cover my-12 rounded-lg animate-rotateZoom' />
                                </div> }

                                <div className='flex text-clamp6 mx-3 mt-1 mb-[3px] touch-auto'>
                                    <div className='w-10 h-10 rounded-full mr-1 border-[1px] border-gray-300 cursor-pointer transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light' onClick={ () => { setClickedBtn( index ); showUsrPicZoomOverlay() } }>
                                        <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-full object-cover w-full h-full cursor-pointer' src={ post.user.picture } alt={ `${ post.user.username } picture` } />
                                    </div>

                                    <div className='flex items-end'>
                                        {/* onclick link to user[user_id] params */ }
                                        { session?.user.user_id === post.user_id ? <p className='mb-[5px]'>You</p> :
                                            <button className={ `mb-[5px] hover:text-appturq active:text-appturq ${ clickedBtn === index && usrLinkEffect && 'animate-resizeBtn' }` }
                                                onClick={ () => { setClickedBtn( index ); usrProfileLnk( `/csian/${ [ post.user_id ] }?pi=${ post.id }` ) } }
                                                onAnimationEnd={ () => setUsrLinkEffect( false ) }
                                            >{ post.user.username }</button> }
                                    </div>
                                </div>

                                <div className='flex justify-end text-clamp2 mx-2 mt-[-10px] mb-[1px] font-extralight'>
                                    <p>{ dateParser( post.createdAt ) }</p>
                                </div>

                                { post.title ? <div className=''><h2 className='text-clamp7 text-center font-medium border-t-2 border-b-2'>{ post.title }</h2></div> : <hr className='border-b-[1.5px]'></hr> }

                                <div>
                                    <p className=' cursor-pointer line-clamp-3 text-clamp1 mx-3 mt-2 mb-3 hover:line-clamp-none active:line-clamp-none'>{ post.content }</p>
                                </div>

                                { post.fileUrl && post.fileUrl?.includes( 'image' ) && <div className='flex w-[260px] h-[150px] max-w[280px] mx-auto my-2 touch-auto' onClick={ () => { setClickedBtn( index ); showPostImgZoomOverlay() } }>
                                    <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-2xl object-cover object-center-up hover:object-center-down hover:shadow-neatcard w-full h-auto max-w-[280px] max-h-[150px] cursor-pointer' src={ post.fileUrl } alt="post image" />
                                </div> }
                                { post.fileUrl && post.fileUrl?.includes( 'audio' ) && <div className='flex justify-center mx-auto my-6'>
                                    <audio controls className='rounded-lg'>
                                        <source src={ post.fileUrl } type='audio/mpeg' />
                                        <source src={ post.fileUrl } type='audio/ogg' />
                                        <source src={ post.fileUrl } type='audio/wav' />
                                        Your browser does not support the audio tag.</audio>
                                </div> }
                                { post.fileUrl && post.fileUrl?.includes( 'video' ) && <div className='flex justify-center mx-auto my-4'>
                                    <video id={ post.id } width="98%" height="200" controls >
                                        <source src={ post.fileUrl } type={ 'video/mp4' } />
                                        <source src={ post.fileUrl } type="video/ogg" />
                                        <source src={ post.fileUrl } type="video/webM" />
                                        Your browser does not support HTML5 video. </video>
                                </div> }

                                { post.link && <LinkVideo postLink={ post.link } postid={ post.id } /> }

                                { session?.user.user_id === post.user_id ? <div className='flex justify-end mb-1 mx-6'>
                                    {/* onclick link to post[id] params */ }
                                    <div className='flex relative items-center mb-2'>
                                        <button title='edit post' onClick={ () => { setClickedBtn( index ); modifBtn( `/upd/${ [ post.id ] }` ) } }
                                            className={ `bg-appstone text-white w-8 h-7 rounded-tl-[15px] rounded-br-[15px] px-2 py-[2px] mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] mx-4 ${ clickedBtn === index && modifyBtnEffect && 'animate-bgSize' }` }>
                                            <FontAwesomeIcon icon={ faPenToSquare } />
                                        </button>
                                    </div>
                                    <div className='flex items-center mb-2'>
                                        <button title='delete post' onClick={ () => { setClickedBtn( index ); handleDelete( post.id ) } } onAnimationEnd={ () => setDeleteBtnEffect( false ) }
                                            className={ `bg-appred text-white w-8 h-7 rounded-tl-[15px] rounded-br-[15px] mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:text-appblck hover:translate-y-[7px] hover:shadow-btnlred bg-[linear-gradient(#ca2401,#ca2401)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] ${ clickedBtn === index && deleteBtnEffect && 'animate-bgSize' }` } >
                                            <FontAwesomeIcon icon={ faTrashCan } />
                                        </button>
                                    </div>
                                </div> : <div></div> }
                                <div>
                                    <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
                                </div>
                                <div className='flex justify-between'>

                                    <PostLiking post={ post } />

                                    {/* comment post */ }
                                    <div className='mr-[48px]' > {/* onClick={()=>handleComment} onAnimationEnd={()=> setCommentEffect(false)} */ }
                                        {/* add button here with animate? */ }
                                        <span className='mr-1'>{ post.discussions }</span>
                                        <button title='enter post discussion' onClick={ () => { setClickedBtn( index ); handleComment( `/coms/${ [ post.id ] }` ) } } onAnimationEnd={ () => setCommentEffect( false ) }
                                            className={ `cursor-pointer hover:opacity-50 ${ clickedBtn === index && commentEffect && 'animate-resizeBtn' }` }>
                                            <FontAwesomeIcon icon={ faComments } style={ { color: '#2ECEC2' } } />
                                        </button>
                                        {/* <Link className='' href={ `/comments/${ [ post.id ] }` }>comments icon</Link> */ }
                                    </div>

                                    {/* share */ }
                                    <div className='mr-4'> {/* onClick={()=>handleShare} onAnimationEnd={()=> setShareEffect(false)}*/ }
                                        {/* add button here with animate? */ }
                                        <button title='share post'><FontAwesomeIcon icon={ faShareFromSquare } style={ { color: '#7953be' } } /></button>

                                    </div>
                                </div>

                                <div className='flex flex-col items-center justify-center my-1 text-clamp2 font-extralight'>
                                    { post.editedAt ? <p className=''>Edited { dateParser2( post.editedAt ) }</p> : <p></p> }
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) ) }
            </div>
        </PageWrap>
    )
}
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PostLiking from './postLiking';

export default function Cards( { posts, session, params, searchParams } ) {
    // console.log( 'posts props: ', posts );
    // console.log( 'session props: ', session );
    const [ loadPost, setLoadPost ] = useState( true );
    const [ count, setCount ] = useState( 5 );
    const [ display, setDisplay ] = useState( posts.slice( 0, count ) );
    console.log( 'display : ', display )
    const [ isImgZoomed, setIsImgZoomed ] = useState( {} );
    const [ isPicZoomed, setIsPicZoomed ] = useState( {} );

    const handleImgZoom = ( index ) => () => {
        setIsImgZoomed( state => ( {
            ...state,
            [ index ]: !state[ index ]
        } ) );
    };
    const handlePicZoom = ( index ) => () => {
        setIsPicZoomed( state => ( {
            ...state,
            [ index ]: !state[ index ]
        } ) );
    };

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

    const loadMore = () => {
        if ( window.innerHeight + document.documentElement.scrollTop + 1 >
            document.scrollingElement.scrollHeight - 200 ) {
            setLoadPost( true )
        }
    };

    useEffect( () => {
        if ( loadPost ) {
            setDisplay( posts.slice( 0, count ) )
            setLoadPost( false )
            setCount( count + 5 )
        }
        window.addEventListener( 'scroll', loadMore )
        return () => window.removeEventListener( 'scroll', loadMore )
    }, [ loadPost, display, count ] )

    return (
        <div>
            { display?.map( ( post, index, params ) => (
                <div key={ post.id } className='border-2 rounded-lg shadow-md my-5 relative'>

                    <div className=''>
                        { post.title ?
                            <h2 className='text-clamp7 text-center font-semibold border-b-2'>{ post.title }</h2> : '' }
                    </div>

                    <div className={ post.fileUrl && post.fileUrl?.includes( 'image' ) ? 'flex w-[260px] h-[150px] max-w[280px] mx-auto my-2' : '' } onClick={ handleImgZoom( index ) }>
                        { post.fileUrl && post.fileUrl?.includes( 'image' ) ? <Image width={ 0 } height={ 0 } placeholder='data:image/...' className={ isImgZoomed[ index ] ? 'imgZoom' : 'imgNorm' } src={ post.fileUrl } alt="post image" /> : '' }
                    </div>
                    <div className={ post.fileUrl && post.fileUrl?.includes( 'audio' ) ? 'flex justify-center mx-auto my-6' : '' }>
                        { post.fileUrl && post.fileUrl?.includes( 'audio' ) && <audio controls className='rounded-lg'>
                            <source src={ post.fileUrl } type='audio/mp3' />
                            {/* <source src={ post.fileUrl } type='audio/mp3' />
                            <source src={ post.fileUrl } type='audio/mp3' /> */}
                            Your browser does not support the audio tag.</audio> }
                    </div>
                    <div className={ post.fileUrl && post.fileUrl?.includes( 'video' ) ? 'flex justify-center mx-auto my-6' : '' }>
                        { post.fileUrl && post.fileUrl?.includes( 'video' ) && <video id={ post.id } width="320" height="176" controls >
                            <source src={ post.fileUrl } type={ 'video/mp4' } />
                            <source src={ post.fileUrl } type="video/ogg" />
                            <source src={ post.fileUrl } type="video/webm" />
                            {/* <source src={ post.fileUrl } type={ 'video/mov' } /> not supported html5 */ }
                            Your browser does not support HTML5 video. </video> }
                    </div>


                    <div>
                        <p className='line-clamp-3 text-clamp1 mx-3 my-1'>{ post.content }</p>
                    </div>

                    { post.link ? <div className='my-1 mx-2 flex justify-center'><a className=' text-[blue]' href={ post.link }>{ post.link }</a></div> : '' }

                    <div className='flex text-clamp6 mx-3 my-1 justify-between'>
                        <div className='flex flex-row '>
                            <div className='w-7 h-7 rounded-full mr-1' onClick={ handlePicZoom( index ) }>
                                <Image width={ 0 } height={ 0 } unoptimized={ true } placeholder='data:image/...' quality={ 100 } className={ isPicZoomed[ index ] ? 'postUserPicZoom' : 'postUserPic' } src={ post.user.picture } alt={ `${ post.user.username } picture` } />
                            </div>
                            <div>
                                {/* onclick link to user[user_id] params */ }
                                { session?.user.username === post.user.username ? <p>You</p> : <Link href={ `/user/${ [ post.user_id ] }` }>{ post.user.username }</Link> }
                            </div>
                        </div>
                        {/* <div className='flex justify-end mx-2'> */ }
                        <PostLiking post={ post } session={ session } />
                        {/* </div> */ }
                    </div>

                    {/* onclick link to post[id] params */ }
                    { session?.user.username === post.user.username ? <div className='flex justify-center items-center mb-2'>
                        <Link className='post_form_btn_submit' href={ `/post/${ [ post.id ] }` }>Modify post</Link>
                    </div> : '' }
                    <div className='flex justify-center my-1'>
                        <p>{ dateParser( post.createdAt ) }</p>
                    </div>
                    { dateParser( post.updatedAt ) > dateParser( post.createdAt ) ? <p className='flex justify-center my-1'>Edited on { post.updatedAt }</p> : '' }
                </div>
            ) ) }
        </div>

    )
}
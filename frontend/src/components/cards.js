'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


export default function Cards( { posts, session, params, searchParams } ) {
    console.log( 'posts props: ', posts );
    console.log( 'session props: ', session );

    const [ isImgZoomed, setIsImgZoomed ] = useState( {} );
    const [ isPicZoomed, setIsPicZoomed ] = useState( {} );

    const handleImgZoom = ( index ) => () => {
        setIsImgZoomed( state => ( {
            ...state,
            [ index ]: !state[ index ]
        } ) );
    }
    const handlePicZoom = ( index ) => () => {
        setIsPicZoomed( state => ( {
            ...state,
            [ index ]: !state[ index ]
        } ) );
    }

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
    }

    // update posts function

    return (
        <div>
            { posts?.map( ( post, index ) => (

                <div key={ post.id } className='border-2 rounded-lg shadow-md my-5 relative'>
                    <div className=''>
                        { post.title ? <h2 className='text-clamp7 text-center font-semibold border-b-2'>{ post.title }</h2> : '' }
                    </div>
                    <div className={ post.fileUrl ? 'flex w-[260px] h-[150px] max-w[280px] mx-auto my-2' : '' } onClick={ handleImgZoom( index ) }>
                        { post.fileUrl && post.fileUrl?.includes( 'image' ) ? <Image width={ 0 } height={ 0 } placeholder='data:image/...' className={ isImgZoomed[ index ] ? 'imgZoom' : 'imgNorm' } src={ post.fileUrl } alt="post image" /> :
                            post.fileUrl?.includes( 'video' ) ? <video id={ post.id } width="320" height="176" controls > <source src={ post.fileUrl } type='video/mp4' /> Your browser does not support HTML5 video. </video> :
                                post.fileUrl?.includes( 'audio' ) ? <audio controls > <source src={ post.fileUrl } type='audio/mp3' /> Your browser does not support the audio tag.</audio> : '' }
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
                        <div className='flex justify-end mx-2'>
                            {/* if not working in client component, add in likepost component for fetching api with onclick */ }
                            <span className='mr-1 cursor-pointer hover:text-green-600 hover:shadow-md hover:rounded-xl hover:bg-green-600 hover:bg-opacity-10'  >{ post.likes }👍</span>
                            <span className='ml-1 cursor-pointer hover:text-red-500 hover:shadow-md hover:rounded-xl hover:bg-red-500 hover:bg-opacity-10' >{ post.dislikes }👎</span>
                        </div>

                    </div>
                    <div className='flex justify-center my-1'>
                        <p>{ dateParser( post.createdAt ) }</p>
                    </div>
                </div>
            ) ) }
        </div>

    )
}
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

    return (
        <div>
            { posts?.map( ( post, index ) => (

                <div key={ post.id } className='border-2 rounded-lg shadow-md my-3 relative'>
                    <div className=''>
                        { post.title ? <h2 className='text-clamp7 text-center font-semibold border-b-2'>{ post.title }</h2> : '' }
                    </div>
                    <div className={ post.fileUrl ? 'flex w-[260px] h-[150px] max-w[280px] mx-auto my-4' : '' } onClick={ handleImgZoom( index ) }>
                        { post.fileUrl && post.fileUrl?.includes( 'image' ) ? <Image width={ 0 } height={ 0 } placeholder='data:image/...' className={ isImgZoomed[ index ] ? 'imgZoom' : 'imgNorm' } src={ post.fileUrl } alt="post image" /> :
                            post.fileUrl?.includes( 'video' ) ? <video id={ post.id } width="320" height="176" controls > <source src={ post.fileUrl } type='video/mp4' /> Your browser does not support HTML5 video. </video> :
                                post.fileUrl?.includes( 'audio' ) ? <audio controls > <source src={ post.fileUrl } type='audio/mp3' /> Your browser does not support the audio tag.</audio> : '' }
                    </div>
                    <div>
                        <p className='text-clamp1 mx-2 mt-2'>{ post.content }</p>
                    </div>
                    <div className='my-3 mx-2 flex justify-center'>
                        { post.link ? <a className=' text-[blue]' href={ post.link }>{ post.link }</a> : '' }
                    </div>
                    <div className='flex justify-end mx-3'>
                        <span>{ post.likes }👍 { post.dislikes }👎 </span>
                    </div>
                    <div className='flex text-clamp6 mx-3 my-2'>
                        <div className='w-7 h-7 rounded-full mr-1' onClick={ handlePicZoom( index ) }>
                            <Image width={ 0 } height={ 0 } unoptimized={ true } placeholder='data:image/...' quality={ 100 } className={ isPicZoomed[ index ] ? 'postUserPicZoom' : 'postUserPic' } src={ post.user.picture } alt={ `${ post.user.username } picture` } />
                        </div>
                        <div>
                            {/* onclick link to otherUsers or import component otherusers with userid props or function onclick with (userid) */ }
                            { session?.user.username === post.user.username ? <p>You</p> : <Link href={ `/user/${ [ post.user_id ] }` }>{ post.user.username }</Link> }
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <p>{ dateParser( post.createdAt ) }</p>
                    </div>
                </div>
            ) ) }
        </div>

    )
}
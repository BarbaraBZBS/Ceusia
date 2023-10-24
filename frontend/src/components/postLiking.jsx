'use client';
import React, { useEffect, useState } from 'react';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as thumbupempty, faThumbsDown as thumbdownempty } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as thumbupfull, faThumbsDown as thumbdownfull, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useRouter } from 'next/navigation';

export default function PostLiking( { post } ) {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [ likes, setLikes ] = useState( post.likes );
    const [ dislikes, setDislikes ] = useState( post.dislikes );
    const [ liked, setLiked ] = useState( false );
    const [ disliked, setDisliked ] = useState( false );
    const [ likeEffect, setLikeEffect ] = useState( false );
    const [ dislikeEffect, setDislikeEffect ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );

    const like = async () => {
        setErrMsg( '' );
        try {
            const resp = await axiosAuth.post( `/posts/${ post.id }/like` )
            const likeStat = resp.data.message
            if ( likeStat === 'post liked !' ) {
                setLiked( true );
                setDisliked( false );
            }
            if ( likeStat === 'post unliked !' ) {
                setLiked( false );
                setDisliked( false );
            }
            const res = await axiosAuth.get( `/posts/${ post.id }` )
            setLikes( res.data.likes )
            setDislikes( res.data.dislikes )
        }
        catch ( err ) {
            if ( !err?.response ) {
                console.log( err )
                setErrMsg( 'No response.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 );
            }
            else {
                console.log( err )
                setErrMsg( 'Like failed.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 )
            }
        }
    };

    const dislike = async () => {
        setErrMsg( '' );
        try {
            const resp = await axiosAuth.post( `/posts/${ post.id }/dislike` )
            const dislikeStat = resp.data.message
            if ( dislikeStat === 'post disliked !' ) {
                setDisliked( true );
                setLiked( false );
            }
            if ( dislikeStat === 'post dislike removed !' ) {
                setDisliked( false );
                setLiked( false );
            }
            const res = await axiosAuth.get( `/posts/${ post.id }` )
            setDislikes( res.data.dislikes )
            setLikes( res.data.likes )
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
                setErrMsg( 'Dislike failed.' )
                setTimeout( () => {
                    setErrMsg( '' )
                }, 4000 )
            }
        }
    };

    const likeBtn = () => {
        like();
        setLikeEffect( true );
    };

    const dislikeBtn = () => {
        dislike();
        setDislikeEffect( true );
    };

    useEffect( () => {
        const checkLiked = async () => {
            const data = { post_id: post.id }
            const likeRes = await axiosAuth( {
                method: 'post',
                url: 'posts/likestatus',
                data: data
            } )
            const likeResData = likeRes.data.message
            if ( likeResData === 'liked: ' ) {
                setLiked( true );
                setDisliked( false );
            }
            if ( likeResData === 'disliked: ' ) {
                setDisliked( true );
                setLiked( false );
            }
        }
        checkLiked();
    }, [ axiosAuth, post, liked, disliked, router, pathname ] );

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex justify-end mx-2'>
                    { liked ? <><span className='ml-2'>{ likes }</span><button title='unlike' onClick={ () => likeBtn() } onAnimationEnd={ () => setLikeEffect( false ) } className={ `px-[3px] cursor-pointer opacity-50 hover:rounded-xl hover:bg-red-600 hover:bg-opacity-30 ${ likeEffect && 'animate-fill' }` } >
                        <FontAwesomeIcon icon={ thumbupfull } style={ { color: "#65A30D" } }
                            className='' /></button></>
                        : <><span className='ml-2'>{ likes }</span><button title='like' onClick={ () => likeBtn() } onAnimationEnd={ () => setLikeEffect( false ) } className={ `px-[3px] cursor-pointer hover:rounded-xl hover:bg-green-600 hover:bg-opacity-20 ${ likeEffect && 'animate-scale' }` }  >
                            <FontAwesomeIcon icon={ thumbupempty } style={ { color: "#65A30D" } }
                                className='' /></button></>
                    }
                    { disliked ? <><span className='ml-[5px]'>{ dislikes }</span><button title='remove dislike' onClick={ () => dislikeBtn() } onAnimationEnd={ () => setDislikeEffect( false ) } className={ `px-[3px] cursor-pointer opacity-50 hover:rounded-xl hover:bg-green-600 hover:bg-opacity-30 ${ dislikeEffect && 'animate-scale' }` } >
                        <FontAwesomeIcon icon={ thumbdownfull } style={ { color: "#F43F5E" } }
                            className='' /></button></>
                        : <><span className='ml-[5px]'>{ dislikes }</span><button title='dislike' onClick={ () => dislikeBtn() } onAnimationEnd={ () => setDislikeEffect( false ) } className={ `px-[3px] cursor-pointer hover:rounded-xl hover:bg-red-500 hover:bg-opacity-20 ${ dislikeEffect && 'animate-fill' }` } >
                            <FontAwesomeIcon icon={ thumbdownempty } style={ { color: "#F43F5E" } }
                                className='' /></button></>
                    }
                </div>
                <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light rounded-md w-fit px-2 text-clamp6 mx-0 my-2' : 'hidden' } aria-live="assertive">{ errMsg }</p>
            </div>
        </>
    )
}

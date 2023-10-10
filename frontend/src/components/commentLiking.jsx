'use client';
import React, { useEffect, useState } from 'react';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heartempty, faThumbsUp as thumbupempty, faHeartCrack as heartcrackempty, faThumbsDown as thumbdownempty } from '@fortawesome/free-regular-svg-icons';
import { faHeart as heartfull, faHeartCrack as heartcrackfull, faThumbsUp as thumbupfull, faThumbsDown as thumbdownfull } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useRouter } from 'next/navigation';

export default function CommentLiking( { post, comment, errorMsg } ) {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [ likes, setLikes ] = useState( comment.likes );
    const [ dislikes, setDislikes ] = useState( comment.dislikes );
    const [ liked, setLiked ] = useState( false );
    const [ disliked, setDisliked ] = useState( false );
    const [ likeEffect, setLikeEffect ] = useState( false );
    const [ dislikeEffect, setDislikeEffect ] = useState( false );

    const like = async () => {
        errorMsg( '' );
        try {
            const resp = await axiosAuth.post( `/posts/comment/${ comment.id }/like` )
            const likeStat = resp.data.message
            if ( likeStat === 'comment liked !' ) {
                setLiked( true );
                setDisliked( false );
            }
            if ( likeStat === 'comment unliked !' ) {
                setLiked( false );
                setDisliked( false );
            }
            const res = await axiosAuth.get( `/posts/${ post.id }/comment/${ comment.id }` )
            setLikes( res.data.likes )
            setDislikes( res.data.dislikes )
        }
        catch ( err ) {
            if ( !err?.response ) {
                console.log( err )
                errorMsg( 'No response.' )
                setTimeout( () => {
                    errorMsg( '' )
                }, 4000 );
            }
            else {
                console.log( err )
                errorMsg( 'Like failed.' )
                setTimeout( () => {
                    errorMsg( '' )
                }, 4000 )
            }
        }
    }
    const dislike = async () => {
        errorMsg( '' );
        try {
            const resp = await axiosAuth.post( `/posts/comment/${ comment.id }/dislike` )
            const dislikeStat = resp.data.message
            if ( dislikeStat === 'comment disliked !' ) {
                setDisliked( true );
                setLiked( false );
            }
            if ( dislikeStat === 'comment dislike removed !' ) {
                setDisliked( false );
                setLiked( false );
            }
            const res = await axiosAuth.get( `/posts/${ post.id }/comment/${ comment.id }` )
            setDislikes( res.data.dislikes )
            setLikes( res.data.likes )
        }
        catch ( err ) {
            if ( !err?.response ) {
                console.log( err )
                errorMsg( 'No response.' )
                setTimeout( () => {
                    errorMsg( '' )
                }, 4000 )
            }
            else {
                console.log( err )
                errorMsg( 'Dislike failed.' )
                setTimeout( () => {
                    errorMsg( '' )
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
        async function checkLiked() {
            const data = { comment_id: comment.id }
            const likeRes = await axiosAuth( {
                method: 'post',
                url: 'posts/commentlikestatus',
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
        checkLiked()
    }, [ axiosAuth, comment, liked, disliked, router, pathname ] )

    return (
        <>
            <div className=''>
                <div className=''>
                    { liked ? <><span className='ml-2'>{ likes }</span><button title='unlike' onClick={ () => likeBtn() } onAnimationEnd={ () => setLikeEffect( false ) } className={ `px-[3px] cursor-pointer opacity-50 hover:rounded-xl hover:bg-red-600 hover:bg-opacity-30 mr-1 ${ likeEffect && 'animate-fill' }` } >
                        <FontAwesomeIcon icon={ heartfull } style={ { color: "#65A30D" } }
                            className='' />
                    </button></>
                        : <><span className='ml-2'>{ likes }</span>
                            <button title='like' onClick={ () => likeBtn() } onAnimationEnd={ () => setLikeEffect( false ) } className={ `px-[3px] cursor-pointer hover:rounded-xl hover:bg-green-600 hover:bg-opacity-20 mr-1 ${ likeEffect && 'animate-scale' }` }  >
                                <FontAwesomeIcon icon={ heartempty } style={ { color: "#65A30D" } }
                                    className='' />
                            </button>
                        </>
                    }
                    { disliked ? <><span className='ml-[5px]'>{ dislikes }</span><button title='remove dislike' onClick={ () => dislikeBtn() } onAnimationEnd={ () => setDislikeEffect( false ) } className={ `px-[3px] cursor-pointer opacity-50 hover:rounded-xl hover:bg-green-600 hover:bg-opacity-30 ${ dislikeEffect && 'animate-scale' }` } >
                        <FontAwesomeIcon icon={ heartcrackfull } style={ { color: "#F43F5E" } }
                            className='' /></button></>
                        : <><span className='ml-[5px]'>{ dislikes }</span><button title='dislike' onClick={ () => dislikeBtn() } onAnimationEnd={ () => setDislikeEffect( false ) } className={ `px-[3px] cursor-pointer hover:rounded-xl hover:bg-red-500 hover:bg-opacity-20 ${ dislikeEffect && 'animate-fill' }` } >
                            <FontAwesomeIcon icon={ thumbdownempty } style={ { color: "#F43F5E" } }
                                className='' /></button></>
                    }
                </div>
            </div>
        </>
    )
}

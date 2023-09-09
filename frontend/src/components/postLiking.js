'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

export const revalidate = 0;

export default function PostLiking( { post, session } ) {
    const axiosAuth = useAxiosAuth();
    // console.log( 'session post liking : ', session )
    const [ likes, setLikes ] = useState( post.likes );
    const [ dislikes, setDislikes ] = useState( post.dislikes );
    const [ liked, setLiked ] = useState( false );
    const [ disliked, setDisliked ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );

    const like = async () => {
        setErrMsg( '' );
        try {
            const resp = await axiosAuth.post( `/posts/${ post.id }/like` )
            const likeStat = resp.data.message
            if ( likeStat === 'post liked !' ) {
                setLiked( true )
            }
            if ( likeStat === 'post unliked !' ) {
                setLiked( false )
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
    }
    const dislike = async () => {
        setErrMsg( '' );
        try {
            const resp = await axiosAuth.post( `/posts/${ post.id }/dislike` )
            const dislikeStat = resp.data.message
            if ( dislikeStat === 'post disliked !' ) {
                setDisliked( true )
            }
            if ( dislikeStat === 'post dislike removed !' ) {
                setDisliked( false )
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
    }

    useEffect( () => {
        async function checkLiked() {
            const likeRes = await axios.post( '/posts/likestatus', {
                post_id: post.id,
                user_id: post.user_id
            } )
            const likeResData = likeRes.data.message
            if ( likeResData === 'liked: ' ) {
                setLiked( true )
                setDisliked( false )
            }
            if ( likeResData === 'disliked: ' ) {
                setDisliked( true )
                setLiked( false )
            }
        }
        checkLiked()
    }, [ post, like, dislike ] )

    return (
        <div>
            <div className='flex flex-col'>
                <div className='flex justify-end mx-2'>
                    <span onClick={ like } className={ liked ? 'likedSpan' : 'likeSpan' }  >{ likes }👍</span>
                    <span onClick={ dislike } className={ disliked ? 'dislikedSpan' : 'dislikeSpan' } >{ dislikes }👎</span>
                </div>
                <p className={ errMsg ? 'errMsg text-clamp6 mx-0 my-2' : 'offscreen' } aria-live="assertive">{ errMsg }</p>
            </div>
        </div>
    )
}

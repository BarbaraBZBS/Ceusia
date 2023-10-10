'use client';
import React, { useState, useEffect } from 'react';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import PostLiking from './postLiking';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEraser, faXmark, faPhotoFilm, faMusic } from '@fortawesome/free-solid-svg-icons';

export default function CommentAdd( { post, setPost, setAllComms, setAddComm } ) {
    const axiosAuth = useAxiosAuth();
    const [ addCommentBtnEffect, setAddCommentBtnEffect ] = useState( false );
    const [ resetCommentBtnEffect, setResetCommentBtnEffect ] = useState( false );
    const [ backCommentBtnEffect, setBackCommentBtnEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setError,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm( {
        defaultValues: {
            message: '',
            image: ''
        },
        mode: "onSubmit",
    } );
    const msg = watch( 'message' );
    const imgwatch = watch( 'image' );

    const refreshPost = async () => {
        const resp = await axiosAuth.get( `posts/${ post.id }` )
        setPost( resp.data )
        return resp.data
    };

    const submitAddComment = async ( data, e ) => {
        e.preventDefault();
        setErrMsg( '' );
        let headers;
        if ( data.image <= 0 ) {
            data = {
                message: getValues( "message" ),
            };
            headers = { 'Content-Type': 'application/json' };
        }
        else {
            const form = new FormData();
            form.append( "image", data.image[ 0 ] );
            form.append( "message", getValues( "message" ) );
            data = form;
            headers = { 'Content-Type': "multipart/form-data" }
        }
        setTimeout( async () => {
            try {
                await axiosAuth( {
                    method: "post",
                    url: `/posts/${ post.id }/comment`,
                    data: data,
                    headers: headers
                } )
                    .then( async ( response ) => {
                        console.log( response );
                        await refreshPost();
                        const resp = await axiosAuth.get( `/posts/${ post.id }/comments` );
                        setAllComms( resp.data );
                        setAddComm( false );
                    } )
            }
            catch ( err ) {
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
                }
                else if ( err.response?.status === 409 ) {
                    setError( 'image', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
                }
                else if ( err.response?.status === 403 ) {
                    setError( 'image', { type: 'custom', message: 'Bad file type. (picture only)' } );
                }
                else {
                    setErrMsg( 'Comment creation failed, please try again.' );
                    await refreshPost();
                }
            }
        }, 500 );
    };

    const resetCommentBtn = async () => {
        setResetCommentBtnEffect( true );
        setErrMsg( '' );
        reset();
    };

    const commentbackBtn = () => {
        setBackCommentBtnEffect( true );
        setErrMsg( '' );
        setTimeout( async () => {
            await refreshPost();
            setAddComm( false );
        }, 500 );
    };

    useEffect( () => {
        if ( isSubmitSuccessful ) {
            setErrMsg( '' );
            reset();
        }
    }, [ isSubmitSuccessful, reset ] );

    return (
        <div className=''> {/* btn submit  onClick={ () => hidePostImgZoomOverlay() }*/ }
            <form className='flex flex-col mx-auto w-[96%] h-auto z-[999] items-center text-clamp6 mt-6 mb-3' onSubmit={ handleSubmit( submitAddComment ) }>
                <textarea type="text" placeholder='Your message...' { ...register( "message", {
                    required: 'This field is required'
                } ) } className={ `border-2 border-appstone rounded-md drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[80%] h-14 resize mt-0 mb-2 ${ errors.message ? 'border-appred focus:border-appred' : '' }` } />
                { errors.message && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mb-5'>{ errors.message.message }</span> }
                <div className={ `relative hover:opacity-70 ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                    <input onClick={ () => setFileWiggle( true ) } type="file" name='image' placeholder='A video, image, or audio file...' { ...register( "image" ) }
                        className='border-2 border-appstone rounded-md my-1 drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[45px] h-[25px] opacity-0 file:cursor-pointer' />
                    <FontAwesomeIcon icon={ faPhotoFilm } size='xl' style={ { color: "#4E5166" } }
                        className='absolute left-[0px] top-[3px] -z-20' />
                    <FontAwesomeIcon icon={ faMusic } size='xl' style={ errors.fileUrl ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                        className='absolute left-[18px] top-[3px] -z-10' />
                </div>
                { imgwatch && imgwatch[ 0 ] ?
                    <p className={ `max-w-[325px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                                ${ errors.image ? 'text-red-600 underline underline-offset-2 font-semibold' : '' }` }>
                        { imgwatch[ 0 ].name }</p> : <p className='mx-3'>No file selected</p> }
                { errors.image && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mt-1 mb-2'>{ errors.image.message }</span> }
                <div className='flex w-full justify-around'>
                    <div className='flex w-[30%] justify-evenly'>
                        <button title='cancel' type='button' onClick={ () => commentbackBtn() } onAnimationEnd={ () => setBackCommentBtnEffect( false ) }
                            className={ `h-[26px] w-8 bg-appred text-appblck rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-opacity-60 hover:translate-y-[5px] hover:shadow-btnlred ${ backCommentBtnEffect && 'animate-pressDown bg-apppastgreen' }` }>
                            <FontAwesomeIcon icon={ faXmark } size='xl' />
                        </button>
                        <button title='reset' type='button' onClick={ () => resetCommentBtn() } onAnimationEnd={ () => setResetCommentBtnEffect( false ) }
                            className={ `h-[26px] w-8 bg-[#FF7900] text-appblck rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[5px] hover:shadow-btnorange ${ resetCommentBtnEffect && 'animate-pressDown bg-apppastgreen' }` }>
                            <FontAwesomeIcon icon={ faEraser } size='lg' />
                        </button>
                    </div>
                    <button title='send new comment' type="submit" disabled={ !msg } onClick={ () => setAddCommentBtnEffect( true ) } onAnimationEnd={ () => setAddCommentBtnEffect( false ) }
                        className={ `h-[26px] w-8 bg-appstone text-white rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnblue disabled:opacity-50 ${ addCommentBtnEffect && 'animate-pressDown bg-apppastgreen' }` }>
                        <FontAwesomeIcon icon={ faPlus } size='lg' />
                    </button>
                </div>
                <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
            </form>
        </div>
    )
}

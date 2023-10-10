'use client';
import React, { useState, useEffect } from 'react';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faCheck, faPhotoFilm, faMusic, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';


export default function CommentUpdate( { comment, post, setupdcomcard, setcomments } ) {
    const axiosAuth = useAxiosAuth();
    const [ updCommentBtnEffect, setUpdCommentBtnEffect ] = useState( false );
    const [ resetCommentUpdBtnEffect, setResetCommentUpdBtnEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ fileDeleteEffect, setFileDeleteEffect ] = useState( false );
    const [ commentImg, setCommentImg ] = useState();
    const [ updatedComment, setUpdatedComment ] = useState( comment );
    const [ errMsg, setErrMsg ] = useState( '' );
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        reset,
        formState: { errors },
    } = useForm( {
        defaultValues: {
            message: comment.message,
            image: comment.image
        },
        mode: "onSubmit",
    } );
    const msg = watch( 'message' );
    const imgwatch = watch( 'image' );

    const handleUpdateComment = ( data, e ) => {
        e.preventDefault();
        setErrMsg( '' );
        let headers;
        if ( data.image <= 0 ) {
            data = { message: getValues( 'message' ) };
            headers = { 'Content-Type': 'application/json' };
        }
        else {
            const form = new FormData();
            form.append( "image", data.image[ 0 ] );
            form.append( "message", getValues( "message" ) );
            data = form;
            headers = { 'Content-Type': "multipart/form-data" };
        };
        setTimeout( async () => {
            try {
                await axiosAuth( {
                    method: 'put',
                    url: `/posts/${ post.id }/comment/${ comment.id }`,
                    data: data,
                    headers: headers
                } )
                    .then( async ( resp ) => {
                        if ( resp ) {
                            const response = await axiosAuth.get( `/posts/${ post.id }/comments` );
                            setcomments( response.data );
                            const res = await axiosAuth.get( `/posts/${ post.id }/comment/${ comment.id }` );
                            reset( { message: res.data.message } );
                            setupdcomcard( false );
                        }
                    } )
            }
            catch ( err ) {
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
                }
                if ( err.response?.status === 404 ) {
                    setErrMsg( 'Comment not found, refresh and try again.' );
                }
                else {
                    setErrMsg( 'Updating failed, please try again.' );
                }
            }
        }, 500 );
    };

    useEffect( () => {
        const handleFile = () => {
            if ( comment?.image ) {
                setCommentImg( comment.image.split( "http://localhost:8000/image/" )[ 1 ] )
            }
        };
        handleFile()
    }, [ comment.image, imgwatch ] );

    const handleFileDelete = () => {
        setFileDeleteEffect( true );
        const data = { image: '' }
        setTimeout( async () => {
            try {
                let answer = window.confirm( 'Are you sure you want to delete this image from your comment?' );
                if ( answer ) {
                    await axiosAuth( {
                        method: "put",
                        url: `/posts/${ post.id }/comment/${ comment.id }`,
                        data: data,
                    } )
                        .then( async ( response ) => {
                            if ( response ) {
                                console.log( 'image removed', response );
                                const res = await axiosAuth.get( `/posts/${ post.id }/comments` );
                                setcomments( res.data );
                                const resp = await axiosAuth.get( `posts/${ post.id }/comment/${ comment.id }` );
                                setUpdatedComment( resp.data );
                            }
                        } )
                }
            }
            catch ( err ) {
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
                }
                else {
                    setErrMsg( 'Image removal failed, please try again.' );
                }
            }
        }, 600 );
    };

    return (
        <div className='border-2 rounded-xl my-3'>
            <form className='flex flex-col mx-auto w-[96%] h-auto z-[999] items-center text-clamp6 mt-6 mb-3' onSubmit={ handleSubmit( handleUpdateComment ) }>
                <textarea type="text" placeholder='Your message...' { ...register( "message", {
                    required: 'This field is required',
                } ) } className={ `border-2 border-appstone rounded-md drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[80%] h-11 resize mt-0 mb-3 ${ errors.message ? 'border-appred focus:border-appred' : '' }` } />
                { errors.message && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mb-5'>{ errors.message.message }</span> }

                <div className={ `relative hover:opacity-70 ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                    <input onClick={ () => setFileWiggle( true ) } type="file" name='image' placeholder='A video, image, or audio file...' { ...register( "image" ) }
                        className='border-2 border-appstone rounded-md my-1 drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[51px] h-[29px] mb-1 opacity-0 file:cursor-pointer' />
                    <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                        className='absolute left-[0px] top-[3px] -z-20' />
                    <FontAwesomeIcon icon={ faMusic } size='2x' style={ errors.image ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                        className='absolute left-[18px] top-[3px] -z-10' />
                </div>
                { imgwatch !== null && imgwatch[ 0 ] && imgwatch[ 0 ]?.name &&
                    <p className={ `max-w-[300px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                        ${ errors.image ? 'text-red-600 mt-1 mb-2 bg-white underline underline-offset-2 font-semibold' : 'mb-3' }` }>
                        { imgwatch[ 0 ].name }</p> }
                { imgwatch !== null && !imgwatch[ 0 ]?.name && updatedComment.image && <><p className='mx-3 mb-1'>No file selected</p>
                    <p className='max-w-[325px] mx-3 mb-3 text-ellipsis overflow-hidden'>Comment file: { commentImg }</p> </> }
                { imgwatch == null && !updatedComment?.image ? <p className='mx-3 mb-3'>No file selected</p> : imgwatch && !imgwatch[ 0 ]?.name && !updatedComment.image && <p className='mx-3 mb-3'>No file selected</p> }
                { updatedComment.image &&
                    <button type='button' title='delete file' onClick={ () => handleFileDelete() } onAnimationEnd={ () => setFileDeleteEffect( false ) }
                        className={ `mb-3 hover:opacity-60 ${ fileDeleteEffect && 'animate-reversePing' }` }>
                        <FontAwesomeIcon icon={ faFileCircleXmark } style={ { color: '#F43F5E' } } size='lg' />
                    </button>
                }
                { errors.image && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mb-4'>{ errors.image.message }</span> }

                <div className='flex w-full justify-around'>
                    <div className='flex w-[50%] justify-evenly items-center'>
                        <button title='reset' type='button' onClick={ () => { setResetCommentUpdBtnEffect( true ); reset() } } onAnimationEnd={ () => setResetCommentUpdBtnEffect( false ) }
                            className={ `bg-[#FF7900] text-appblck w-7 h-7 rounded-full mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange ${ resetCommentUpdBtnEffect && 'animate-pressDown bg-apppastgreen' }` }>
                            <FontAwesomeIcon icon={ faEraser } />
                        </button>
                        <button title='confirm comment update' type="submit" disabled={ msg == comment.message && ( imgwatch === null || !imgwatch[ 0 ]?.name ) } onClick={ () => setUpdCommentBtnEffect( true ) } onAnimationEnd={ () => setUpdCommentBtnEffect( false ) }
                            className={ `bg-appstone text-white w-7 h-7 rounded-full mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[4px] hover:enabled:shadow-btnblue disabled:opacity-50 ${ updCommentBtnEffect && 'animate-pressDown bg-apppastgreen' }` }>
                            <FontAwesomeIcon icon={ faCheck } className='' />
                        </button>
                    </div>
                </div>
                <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
            </form>
        </div>

    )
}

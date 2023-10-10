'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm, faMusic, faEraser, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line max-len
const LINK_REGEX = /^https?:\/\//gm
//or this one to match domains extensions and base urls
// const LINK_REGEX = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/

export default function PostAdd( { setPosts, numb } ) {
    const axiosAuth = useAxiosAuth();
    const [ resetBtnEffect, setResetBtnEffect ] = useState( false );
    const [ sendBtnEffect, setSendBtnEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setError,
        setFocus,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm( {
        defaultValues: {
            title: '',
            content: '',
            fileUrl: '',
            link: '',
        },
        mode: "onSubmit",
    } );
    const filewatch = watch( 'fileUrl' );

    useEffect( () => {
        if ( errors?.content ) {
            setFocus( "content" );
        }
    } );

    const submitForm = async ( data, e ) => {
        e.preventDefault();
        setErrMsg( '' );
        let headers;
        if ( data.fileUrl <= 0 ) {
            data = {
                title: getValues( "title" ),
                content: getValues( "content" ),
                link: getValues( "link" ),
            };
            headers = { 'Content-Type': 'application/json' };
        }
        else {
            const form = new FormData();
            form.append( "fileUrl", data.fileUrl[ 0 ] );
            form.append( "title", getValues( "title" ) );
            form.append( "content", getValues( "content" ) );
            form.append( "link", getValues( "link" ) );
            console.log( 'file upload? : ', form );
            data = form;
            headers = { 'Content-Type': "multipart/form-data" };
        };
        setTimeout( async () => {
            try {
                await axiosAuth( {
                    method: "post",
                    url: `/posts`,
                    data: data,
                    headers: headers,
                    withCredentials: true
                } )
                    .then( async ( response ) => {
                        console.log( response );
                        const resp = await axiosAuth.get( '/posts' )
                        setPosts( resp.data.slice( 0, numb ) )
                    } )
            }
            catch ( err ) {
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
                }
                else if ( err.response?.status === 409 ) {
                    setError( 'fileUrl', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
                }
                else if ( err.response?.status === 403 ) {
                    setError( 'fileUrl', { type: 'custom', message: 'Bad file type. (video, picture or audio only)' } );
                }
                else {
                    setErrMsg( 'Post creation failed, please try again.' );
                }
            }
        }, 500 );
    };

    useEffect( () => {
        if ( isSubmitSuccessful ) {
            reset();
        }
    }, [ isSubmitSuccessful, reset ] );

    const btnReset = () => {
        setResetBtnEffect( true );
        reset();
    };

    return (
        <>
            <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
            {/* <div>preview?</div> */ }
            <div className='flex flex-col items-center w-full'>
                <form className='mb-1 py-1 flex flex-col items-center text-clamp6 w-full' onSubmit={ handleSubmit( submitForm ) }>
                    <input type='text' placeholder="A title..." { ...register( "title" ) } className={ `border-2 border-appstone rounded-md h-6 my-1 drop-shadow-linkTxt w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${ errors.title
                        ? 'border-appred focus:border-appred' : '' }` } />
                    { errors.title && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.title.message }</span> }
                    <textarea type="text" placeholder='Your message...' { ...register( "content", {
                        required: 'This field is required'
                    } ) } className={ `border-2 border-appstone rounded-md my-1 drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[90%] h-14 resize max-w-full ${ errors.content ? 'border-appred focus:border-appred' : '' }` } />
                    { errors.content && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.content.message }</span> }
                    <div className={ `relative hover:opacity-70 ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                        <input onClick={ () => setFileWiggle( true ) } type="file" name='fileUrl' placeholder='A video, image, or audio file...' { ...register( "fileUrl" ) }
                            className='border-2 border-appstone rounded-md my-1 drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[51px] h-[29px] opacity-0 file:cursor-pointer' />
                        <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                            className='absolute left-[0px] top-[3px] -z-20' />
                        <FontAwesomeIcon icon={ faMusic } size='2x' style={ errors.fileUrl ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                            className='absolute left-[18px] top-[3px] -z-10' />
                    </div>
                    { filewatch && filewatch[ 0 ] ?
                        <p className={ `max-w-[325px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                                ${ errors.fileUrl ? 'text-red-600 underline underline-offset-2 font-semibold' : '' }` }>
                            { filewatch[ 0 ].name }</p> : <p className='mx-3'>No file selected</p> }
                    { errors.fileUrl && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mt-1 mb-2'>{ errors.fileUrl.message }</span> }
                    <input type="text" placeholder='A link...' { ...register( "link", {
                        pattern: {
                            value: LINK_REGEX,
                            message: 'Enter a valid link url'
                        }
                    } ) } className={ `border-2 border-appstone rounded-md h-6 my-1 drop-shadow-linkTxt w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${ errors.link ? 'border-appred focus:border-appred' : '' }` } />
                    { errors.link && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.link.message }</span> }
                    <div className='flex w-full justify-around'>
                        <button type='button' title='reset' onClick={ () => btnReset() } onAnimationEnd={ () => setResetBtnEffect( false ) }
                            className={ `bg-[#FF7900] text-appblck w-[36px] h-8 rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange ${ resetBtnEffect && 'animate-pressDown' }` }>
                            <FontAwesomeIcon icon={ faEraser } size='lg' />
                        </button>
                        <button type="submit" title='send a new post' onClick={ () => setSendBtnEffect( true ) } onAnimationEnd={ () => setSendBtnEffect( false ) }
                            className={ `bg-appstone text-white w-[36px] h-8 rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50 ${ sendBtnEffect && 'animate-pressDown' }` }>
                            <FontAwesomeIcon icon={ faCirclePlus } size='lg' />
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

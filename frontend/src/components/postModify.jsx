'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

export default function ModifyPost( { post } ) {
    const router = useRouter();
    const axiosAuth = useAxiosAuth();
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setError,
        reset,
        formState: { errors },
    } = useForm( {
        defaultValues: {
            title: post.title,
            content: post.content,
            fileUrl: post.fileUrl,
            link: post.link,
        },
        // mode: "onBlur"
        mode: "onSubmit"
    } );
    const [ postUpdEffect, setPostUpdEffect ] = useState( false );
    const [ resetUpdEffect, setResetUpdEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const filewatch = watch( 'fileUrl' );
    console.log( filewatch );
    const [ postFile, setPostFile ] = useState();
    const isBrowser = () => typeof window !== 'undefined';

    const submitUpdateForm = async ( data, e ) => {
        e.preventDefault();
        setErrMsg( '' );
        let headers;
        if ( data.fileUrl <= 0 || data.fileUrl == null ) {
            data = {
                title: getValues( 'title' ),
                content: getValues( 'content' ),
                link: getValues( 'link' ),
            };
            headers = {
                'Content-Type': 'application/json',
            };
        }
        else {
            const form = new FormData();
            form.append( "fileUrl", data.fileUrl[ 0 ] );
            form.append( "title", getValues( "title" ) );
            form.append( "content", getValues( "content" ) );
            form.append( "link", getValues( "link" ) );
            console.log( 'file upload? : ', form );
            data = form;
            headers = {
                'Content-Type': "multipart/form-data",
            };
        };
        try {
            await axiosAuth( {
                method: "put",
                url: `/posts/${ post.id }`,
                data: data,
                headers: headers,
            } )
                .then( ( response ) => {
                    if ( response ) {
                        console.log( response );
                        router.push( '/' );
                    }
                } )
        }
        catch ( err ) {
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            if ( err.response?.status === 409 ) {
                setError( 'fileUrl', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'fileUrl', { type: 'custom', message: 'Bad file type. (video, picture or audio only)' } );
            }
            else {
                setErrMsg( 'Posting failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    };

    const handleFile = () => {
        if ( post?.fileUrl ) {
            if ( post.fileUrl.includes( "/image/" ) ) {
                setPostFile( post.fileUrl.split( "http://localhost:8000/image/" )[ 1 ] )
            }
            else if ( post.fileUrl.includes( "/video/" ) ) {
                setPostFile( post.fileUrl.split( "http://localhost:8000/video/" )[ 1 ] )
            }
            else if ( post.fileUrl.includes( "/audio/" ) ) {
                setPostFile( post.fileUrl.split( "http://localhost:8000/audio/" )[ 1 ] )
            };
        }
    };

    useEffect( () => {
        handleFile()
    }, [ filewatch ] );

    const resetBtn = () => {
        reset();
        setResetUpdEffect( true );
    }

    return (
        <div className='my-6 flex flex-col items-center border-apppastgreen bg-apppastgreen bg-opacity-70 border-2 w-[92%] mx-auto rounded-lg shadow-neatcard'>
            <p className={ errMsg ? 'errMsg text-clamp6 mb-2' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

            <div className='flex flex-col items-center w-full'>
                <form className='mb-1 py-8 flex flex-col items-center text-clamp6 w-full z-0' onSubmit={ handleSubmit( submitUpdateForm ) }>

                    <input type='text' placeholder="A title..." { ...register( "title" ) } className={ `post_form_input mb-6 ${ errors.title
                        ? 'border-appred focus:border-appred' : '' }` } />
                    { errors.title && <span className='fieldErrMsg'>{ errors.title.message }</span> }

                    <textarea type="text" placeholder='Your message...' { ...register( "content", {
                        required: 'This field is required'
                    } ) } className={ `post_form_input w-full h-14 resize max-w-[310px] mb-6 ${ errors.content ? 'border-appred focus:border-appred' : '' }` } />
                    { errors.content && <span className='fieldErrMsg mb-5'>{ errors.content.message }</span> }

                    <div className={ `relative ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                        <input onClick={ () => setFileWiggle( true ) } type="file" name='fileUrl' placeholder='A video, image, or audio file...' { ...register( "fileUrl" ) }
                            className='post_form_input w-[51px] h-[29px] mb-1 opacity-0 cursor-pointer' />
                        <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                            className='absolute left-[0px] top-[3px] -z-20' />
                        <FontAwesomeIcon icon={ faMusic } size='2x' style={ errors.fileUrl ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                            className='absolute left-[18px] top-[3px] -z-10' />
                    </div>
                    { filewatch !== null && filewatch[ 0 ] && filewatch[ 0 ]?.name &&
                        <p className={ `max-w-[300px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                        ${ errors.fileUrl ? 'text-red-600 mt-1 mb-2 bg-white underline underline-offset-2 font-semibold' : 'mb-3' }` }>
                            { filewatch[ 0 ].name }</p> }
                    { filewatch !== null && !filewatch[ 0 ]?.name && post.fileUrl && <><p className='mx-3 mb-1'>No file selected</p>
                        <p className='max-w-[325px] mx-3 mb-3 text-ellipsis overflow-hidden'>Post file: { postFile }</p> </> }
                    { filewatch == null && !post?.file ? <p className='mx-3 mb-3'>No file selected</p> : filewatch && !filewatch[ 0 ]?.name && !post.file && <p className='mx-3 mb-3'>No file selected</p> }

                    { errors.fileUrl && <span className='fieldErrMsg mb-4'>{ errors.fileUrl.message }</span> }

                    <input type="text" placeholder='A link...' { ...register( "link" ) } className={ `post_form_input mb-6 ${ errors.link ? 'border-appred focus:border-appred' : '' }` } />
                    { errors.link && <span className='fieldErrMsg'>{ errors.link.message }</span> }

                    <div className='flex w-full justify-around'>
                        <button type='button' onClick={ () => resetBtn() } onAnimationEnd={ () => setResetUpdEffect( false ) } className={ `resetbtn ${ resetUpdEffect && 'animate-moveUp' }` }>Reset Form</button>
                        <button type="submit" onClick={ () => setPostUpdEffect( true ) } onAnimationEnd={ () => setPostUpdEffect( false ) } className={ `post_form_btn_submit ${ postUpdEffect && 'animate-moveUp' }` }>Update Post</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

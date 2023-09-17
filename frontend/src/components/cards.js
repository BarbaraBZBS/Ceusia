'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PostLiking from './postLiking';
import { useForm } from 'react-hook-form';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import LinkVideo from './linkVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function Cards( { posts, session, params, searchParams } ) {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [ loadPost, setLoadPost ] = useState( true );
    const [ count, setCount ] = useState( 5 );
    const [ display, setDisplay ] = useState( posts.slice( 0, count ) );
    // const [ display, setDisplay ] = useState();
    // console.log( 'display : ', display )
    const [ isImgZoomed, setIsImgZoomed ] = useState( {} );
    const [ isPicZoomed, setIsPicZoomed ] = useState( {} );
    const [ resetBtnEffect, setResetBtnEffect ] = useState( false );
    const [ sendBtnEffect, setSendBtnEffect ] = useState( false );
    // const [ modifyBtnEffect, setModifyBtnEffect ] = useState( {} );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const isBrowser = () => typeof window !== 'undefined';
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
        // mode: "onBlur"
        mode: "onSubmit",
        // reValidateMode: "onBlur"
    } );
    const filewatch = watch( 'fileUrl' );

    useEffect( () => {
        if ( errors?.content ) {
            setFocus( "content" );
        }
    } );

    const submitForm = async ( data, e ) => {
        e.preventDefault();
        // setErrMsg( '' );
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
                    const newdisplay = resp.data
                    posts = newdisplay
                    setDisplay( posts.slice( 0, count ) )
                } )
        }
        catch ( err ) {
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            else if ( err.response?.status === 409 ) {
                setError( 'fileUrl', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'fileUrl', { type: 'custom', message: 'Bad file type. (video, picture or audio only)' } );
            }
            else {
                setErrMsg( 'Post creation failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    };

    useEffect( () => {
        if ( isSubmitSuccessful ) {
            reset();
        }
    }, [ isSubmitSuccessful, reset ] );

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

    const handleDelete = async ( postid ) => {
        const res = await axiosAuth.delete( `/posts/${ postid }` )
        console.log( 'deleted ? : ', res )
        if ( !res ) {
            setErrMsg( 'Something went wrong, post is not removed' );
            if ( !isBrowser() ) return;
            window.scrollTo( { top: 0, behavior: 'smooth' } );
        }
        else {
            const resp = await axiosAuth.get( '/posts' )
            const newdisplay = resp.data
            posts = newdisplay
            setDisplay( posts.slice( 0, count ) )
        }
    };

    const loadMore = () => {
        if ( !isBrowser() ) return;
        if ( window.innerHeight + document.documentElement.scrollTop + 1 >
            document.scrollingElement.scrollHeight - 230 ) {
            setLoadPost( true )
        }
    };

    useEffect( () => {
        if ( loadPost ) {
            const newPostLoad = async () => {
                const resp = await axiosAuth.get( '/posts' )
                const newdisplay = resp.data
                posts = newdisplay
                setDisplay( posts.slice( 0, count ) )
                setLoadPost( false )
                setCount( count + 5 )
            }
            newPostLoad()
        }
        if ( !isBrowser() ) return;
        window.addEventListener( 'scroll', loadMore )
        return () => window.removeEventListener( 'scroll', loadMore )
    }, [ loadPost, display, count ] )

    const btnReset = () => {
        reset();
        setResetBtnEffect( true );
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='my-8 flex flex-col items-center w-[331.2px]'>
                {/* post form */ }
                <h2 className='text-clamp7'>What&apos;s on your mind?</h2>
                <>
                    <p className={ errMsg ? 'errMsg text-clamp6 mb-2' : 'offscreen' } aria-live="assertive">{ errMsg }</p>
                    {/* <div>preview?</div> */ }
                    <div className='flex flex-col items-center w-full'>
                        <form className='mb-1 py-1 flex flex-col items-center text-clamp6 w-full' onSubmit={ handleSubmit( submitForm ) }>

                            <input type='text' placeholder="A title..." { ...register( "title" ) } className={ `post_form_input ${ errors.title
                                ? 'border-appred focus:border-appred' : '' }` } />
                            { errors.title && <span className='fieldErrMsg'>{ errors.title.message }</span> }

                            <textarea type="text" placeholder='Your message...' { ...register( "content", {
                                required: 'This field is required'
                            } ) } className={ `post_form_input w-[90%] h-14 resize max-w-full ${ errors.content ? 'border-appred focus:border-appred' : '' }` } />
                            { errors.content && <span className='fieldErrMsg'>{ errors.content.message }</span> }

                            <div className={ `relative ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                                <input onClick={ () => setFileWiggle( true ) } type="file" name='fileUrl' placeholder='A video, image, or audio file...' { ...register( "fileUrl" ) }
                                    className='post_form_input w-[51px] h-[29px] opacity-0 cursor-pointer' />
                                <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                                    className='absolute left-[0px] top-[3px] -z-20' />
                                <FontAwesomeIcon icon={ faMusic } size='2x' style={ errors.fileUrl ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                                    className='absolute left-[18px] top-[3px] -z-10' />
                            </div>
                            { filewatch && filewatch[ 0 ] ?
                                <p className={ `max-w-[325px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                                ${ errors.fileUrl ? 'text-red-600 underline underline-offset-2 font-semibold' : '' }` }>
                                    { filewatch[ 0 ].name }</p> : <p className='mx-3'>No file selected</p> }
                            { errors.fileUrl && <span className='fieldErrMsg mt-1 mb-2'>{ errors.fileUrl.message }</span> }

                            <input type="text" placeholder='A link...' { ...register( "link" ) } className={ `post_form_input ${ errors.link ? 'border-appred focus:border-appred' : '' }` } />
                            { errors.link && <span className='fieldErrMsg'>{ errors.link.message }</span> }

                            <div className='flex w-full justify-around'>
                                <button type='button' onClick={ () => btnReset() } onAnimationEnd={ () => setResetBtnEffect( false ) } className={ `resetbtn ${ resetBtnEffect && 'animate-moveUp' }` }>Reset</button>
                                <button type="submit" onClick={ () => setSendBtnEffect( true ) } onAnimationEnd={ () => setSendBtnEffect( false ) } className={ `post_form_btn_submit ${ sendBtnEffect && 'animate-moveUp' }` }>Send A New Post</button>
                            </div>

                        </form>
                    </div>
                </>
            </div>

            {/* All Posts */ }
            { display?.map( ( post, index, params ) => (
                <div key={ post.id } className='border-2 rounded-lg shadow-md my-5 relative w-[90vw]'>

                    <div className='flex text-clamp6 mx-3 mt-1 mb-[3px] touch-auto'>
                        <div className='w-10 h-10 rounded-full mr-1' onClick={ handlePicZoom( index ) } onTouchStart={ handlePicZoom( index ) }>
                            <Image width={ 0 } height={ 0 } unoptimized={ true } placeholder='data:image/...' quality={ 100 } className={ isPicZoomed[ index ] ? 'postUserPicZoom z-[999] animate-rotateZoom' : 'postUserPic' } src={ post.user.picture } alt={ `${ post.user.username } picture` } />
                            { isPicZoomed[ index ] && <div className='w-[100vw] h[100vh] z-[998] bg-black fixed inset-0 opacity-1'></div> }
                        </div>
                        <div className='flex items-end'>
                            {/* onclick link to user[user_id] params */ }
                            { session?.user.username === post.user.username ? <p className='mb-[5px]'>You</p> :
                                <Link href={ `/user/${ [ post.user_id ] }` } className='mb-[5px] active:text-appturq focus:text-appturq'>{ post.user.username }</Link> }
                        </div>
                    </div>

                    <div className='flex justify-end text-clamp2 mx-2 mt-[-10px] mb-1 font-extralight'>
                        {/* { dateParser( post.updatedAt ) > dateParser( post.createdAt ) ? <p className=''>Edited on { dateParser( post.updatedAt ) }</p> : '' } */ }
                        <p>{ dateParser( post.createdAt ) }</p>
                    </div>

                    { post.title ? <div className=''><h2 className='text-clamp7 text-center font-semibold border-t-2 border-b-2'>{ post.title }</h2></div> : <div className='border-b-2'></div> }

                    <div>
                        <p className=' cursor-pointer line-clamp-3 text-clamp1 mx-3 mt-2 mb-3 hover:line-clamp-none active:line-clamp-none'>{ post.content }</p>
                    </div>

                    <div className={ post.fileUrl && post.fileUrl?.includes( 'image' ) ? 'flex w-[260px] h-[150px] max-w[280px] mx-auto my-2 touch-auto' : 'touch-auto' } onClick={ handleImgZoom( index ) } onTouchStart={ handleImgZoom( index ) }>
                        { post.fileUrl && post.fileUrl?.includes( 'image' ) ? <Image width={ 0 } height={ 0 } placeholder='data:image/...' className={ isImgZoomed[ index ] ? 'imgZoom z-[999] animate-rotateZoom' : 'imgNorm' } src={ post.fileUrl } alt="post image" /> : '' }
                        { isImgZoomed[ index ] && <div className='w-[100vw] h[100vh] z-[998] bg-black fixed inset-0 opacity-1'></div> }
                    </div>
                    <div className={ post.fileUrl && post.fileUrl?.includes( 'audio' ) ? 'flex justify-center mx-auto my-6' : '' }>
                        { post.fileUrl && post.fileUrl?.includes( 'audio' ) && <audio controls className='rounded-lg'>
                            <source src={ post.fileUrl } type='audio/mpeg' />
                            <source src={ post.fileUrl } type='audio/ogg' />
                            <source src={ post.fileUrl } type='audio/wav' />
                            Your browser does not support the audio tag.</audio> }
                    </div>
                    <div className={ post.fileUrl && post.fileUrl?.includes( 'video' ) ? 'flex justify-center mx-auto my-6' : '' }>
                        { post.fileUrl && post.fileUrl?.includes( 'video' ) && <video id={ post.id } width="320" height="176" controls >
                            <source src={ post.fileUrl } type={ 'video/mp4' } />
                            <source src={ post.fileUrl } type="video/ogg" />
                            <source src={ post.fileUrl } type="video/webM" />
                            Your browser does not support HTML5 video. </video> }
                    </div>

                    { post.link && <LinkVideo postLink={ post.link } postid={ post.id } /> }

                    <div className='flex justify-evenly mb-1'>
                        {/* onclick link to post[id] params */ }
                        { session?.user.username === post.user.username ? <div className='flex relative items-center mb-2 group'>
                            <Link className='post_modify_btn transition-[background-size_.5s, color_.5s] active:bg-[size:100%_100%] active:text-white focus:bg-[size:100%_100%] focus:text-white' href={ `/post/${ [ post.id ] }` }>Modify post</Link>
                        </div> : '' }
                        {/* animate-bounce */ }

                        { session?.user.username === post.user.username ? <div className='flex items-center mb-2'>
                            <button onClick={ () => handleDelete( post.id ) } className='post_delete_btn  transition-[background-size_.5s, color_.5s] active:bg-[size:100%_100%] active:text-white focus:bg-[size:100%_100%] focus:text-white' >Delete post</button>
                        </div> : '' }
                    </div>

                    <div className='flex justify-between'>

                        <PostLiking post={ post } session={ session } />

                        {/* comment post */ }
                        <div className='mx-3'>
                            <p>comments</p>
                            {/* <Link className='' href={ `/comments/${ [ post.id ] }` }>comments icon</Link> */ }
                        </div>
                        <div className='mx-3'>
                            <p>share</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center my-1 text-clamp2 font-extralight'>
                        { dateParser( post.updatedAt ) > dateParser( post.createdAt ) ? <p className=''>Edited on { dateParser( post.updatedAt ) }</p> : '' }
                        {/* <p>Created on { dateParser( post.createdAt ) }</p> */ }
                    </div>
                </div>
            ) ) }
        </div>
    )
}
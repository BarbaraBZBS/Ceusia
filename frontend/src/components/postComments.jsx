'use client';
import React, { useState, useEffect } from 'react';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import Image from 'next/image';
import Link from 'next/link';
import PostLiking from './postLiking';
import { useForm } from 'react-hook-form';
import LinkVideo from './linkVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPenFancy, faPhotoFilm, faShareFromSquare, faComments, faPlus, faShare, faPenToSquare, faEraser, faLeftLong, faXmark, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import moment from 'moment/moment';
import CommentUpdate from './commentUpdate';
import CommentAdd from './commentAdd';
import CommentLiking from './commentLiking';

export default function PostComments( { post, comments } ) {
    // console.log( 'commms : ', comments )
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const { data: session } = useSession();
    const [ postDetail, setPostDetail ] = useState( post );
    const [ commentsDetail, setCommentsDetail ] = useState( comments );
    const [ userPicZoom, setUserPicZoom ] = useState( false );
    const [ userComPicZoom, setUserComPicZoom ] = useState( false );
    const [ clickedBtn, setClickedBtn ] = useState( 0 );
    const [ modifyBtnEffect, setModifyBtnEffect ] = useState( false );
    const [ cancelUpdBtnEffect, setCancelUpdBtnEffect ] = useState( false );
    const [ deleteBtnEffect, setDeleteBtnEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ commentEffect, setCommentEffect ] = useState( false );
    const [ shareEffect, setShareEffect ] = useState( false );
    const [ showForm, setShowForm ] = useState( false );
    const [ newComment, setNewComment ] = useState( false );
    const [ postFile, setPostFile ] = useState();
    const [ fileDeleteEffect, setFileDeleteEffect ] = useState( false );
    const [ postUpdEffect, setPostUpdEffect ] = useState( false );
    const [ resetUpdEffect, setResetUpdEffect ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const [ updCommentBtnEffect, setUpdCommentBtnEffect ] = useState( false );
    const [ updCommentCard, setUpdCommentCard ] = useState( false );
    const [ delCommentBtnEffect, setDelCommentBtnEffect ] = useState( false );
    const [ shareCommentBtnEffect, setShareCommentBtnEffect ] = useState( false );
    const [ commentImgZoom, setCommentImgZoom ] = useState( false );
    const [ updatedPostDetail, setUpdatedPostDetail ] = useState( post );
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
            title: postDetail.title,
            content: postDetail.content,
            fileUrl: postDetail.fileUrl,
            link: postDetail.link,
        },
        mode: "onSubmit",
        // reValidateMode: "onBlur"
    } );
    const filewatch = watch( 'fileUrl' );
    // console.log( 'file : ', filewatch )
    const ttl = watch( 'title' );
    const ctt = watch( 'content' );
    const lnk = watch( 'link' );
    // console.log( 'post details : ', postDetail )

    useEffect( () => {
        if ( errors?.content ) {
            setFocus( "content" );
        }
    } );

    const refreshPost = async () => {
        const resp = await axiosAuth.get( `posts/${ post.id }` )
        setPostDetail( resp.data )
        return resp.data
    };

    const dateParser2 = ( num ) => {
        const timeAgo = moment( num ).fromNow()
        return timeAgo
    };

    // handle overlays function
    function showOverlay() {
        const scrollY = document.documentElement.style.getPropertyValue(
            "--scroll-y"
        );
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${ scrollY }`;
    };
    function hideOverlay() {
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = "";
        body.style.top = "";
        if ( !isBrowser() ) return;
        window.scrollTo( 0, parseInt( scrollY || "0" ) * -1 );
    };
    // post user picture zoom
    function showUsrPicZoomOverlay() {
        setUserPicZoom( true );
        showOverlay();
    };
    function hideUsrPicZoomOverlay() {
        hideOverlay();
        setUserPicZoom( false );
    };
    // comments user pic zoom
    function showUsrPicComZoomOverlay() {
        setUserComPicZoom( true );
        showOverlay();
    };
    function hideUsrPicComZoomOverlay() {
        hideOverlay();
        setUserComPicZoom( false );
    };
    // update post form overlay
    function showFormOverlay() {
        setShowForm( true );
        showOverlay();
    };
    function hideFormOverlay() {
        hideOverlay();
        setShowForm( false );
    };
    function showCommImgZoomOverlay() {
        setCommentImgZoom( true );
        showOverlay();
    };
    function hideCommImgZoomOverlay() {
        hideOverlay();
        setCommentImgZoom( false );
    };

    const modifBtn = () => {
        setModifyBtnEffect( true );
        setTimeout( () => {
            showFormOverlay();
        }, 500 );
    };

    const cancelbackBtn = () => {
        setCancelUpdBtnEffect( true );
        setTimeout( () => {
            hideFormOverlay();
        }, 500 );
    };

    const resetBtn = async () => {
        setResetUpdEffect( true );
        const data = await refreshPost()
        reset( { ...data } );
    };

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
            headers = { 'Content-Type': 'application/json' };
        }
        else {
            const form = new FormData();
            form.append( "fileUrl", data.fileUrl[ 0 ] );
            form.append( "title", getValues( "title" ) );
            form.append( "content", getValues( "content" ) );
            form.append( "link", getValues( "link" ) );
            // console.log( 'file upload? : ', form );
            data = form;
            headers = { 'Content-Type': "multipart/form-data" };
        };
        setTimeout( async () => {
            try {
                await axiosAuth( {
                    method: "put",
                    url: `/posts/${ post.id }`,
                    data: data,
                    headers: headers,
                } )
                    .then( async ( response ) => {
                        if ( response ) {
                            // console.log( response );
                            hideFormOverlay();
                            const reload = await refreshPost();
                            setPostDetail( reload )
                        }
                    } )
            }
            catch ( err ) {
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
                }
                if ( err.response?.status === 409 ) {
                    setError( 'fileUrl', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
                }
                else if ( err.response?.status === 403 ) {
                    setError( 'fileUrl', { type: 'custom', message: 'Bad file type. (video, picture or audio only)' } );
                }
                else {
                    setErrMsg( 'Posting failed, please try again.' );
                }
            }
        }, 500 );
    };

    const handleDelete = ( postid ) => {
        setDeleteBtnEffect( true );
        setErrMsg( '' );
        setTimeout( async () => {
            try {
                let answer = window.confirm( 'Are you sure you want to delete this post?' );
                if ( answer ) {
                    const res = await axiosAuth.delete( `/posts/${ postid }` )
                    // console.log( 'deleted ? : ', res )
                    if ( !res ) {
                        setErrMsg( 'Something went wrong, post was not removed' );
                    }
                    else {
                        hideFormOverlay()
                        router.push( '/' )
                    }
                };
            }
            catch ( err ) {
                console.log( 'delete post err : ', err )
                setErrMsg( 'Something went wrong, post was not removed' );
            }
        }, 700 );
    };

    const handleFileDelete = () => {
        setFileDeleteEffect( true );
        const data = { fileUrl: '' }
        setTimeout( async () => {
            try {
                let answer = window.confirm( 'Are you sure you want to delete this file from your post?' );
                if ( answer ) {
                    await axiosAuth( {
                        method: "put",
                        url: `/posts/${ post.id }`,
                        data: data,
                    } )
                        .then( async ( response ) => {
                            if ( response ) {
                                // console.log( 'file removed', response );
                                const res = await axiosAuth.get( `/posts/${ post.id }` );
                                setUpdatedPostDetail( res.data )
                                setPostDetail( res.data )
                            }
                        } )
                }
            }
            catch ( err ) {
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
                }
                else {
                    setErrMsg( 'Failed removing file, please try again.' );
                }
            }
        }, 600 );
    };

    useEffect( () => {
        const handleFile = () => {
            if ( postDetail?.fileUrl ) {
                if ( postDetail.fileUrl.includes( "/image/" ) ) {
                    setPostFile( postDetail.fileUrl.split( "http://localhost:8000/image/" )[ 1 ] )
                }
                else if ( postDetail.fileUrl.includes( "/video/" ) ) {
                    setPostFile( postDetail.fileUrl.split( "http://localhost:8000/video/" )[ 1 ] )
                }
                else if ( postDetail.fileUrl.includes( "/audio/" ) ) {
                    setPostFile( postDetail.fileUrl.split( "http://localhost:8000/audio/" )[ 1 ] )
                };
            }
        };
        handleFile();
    }, [ postDetail.fileUrl, filewatch ] );

    useEffect( () => {
        const resetForm = () => {
            if ( isSubmitSuccessful ) {
                setTimeout( async () => {
                    setErrMsg( '' );
                    const resp = await axiosAuth.get( `posts/${ post.id }` )
                    reset( { ...resp.data } );
                }, 600 );
            }
        }
        resetForm()
    } );

    const addComment = () => {
        setCommentEffect( true );
        setTimeout( () => {
            setNewComment( !newComment );
        }, 500 );
    };

    const commentUpdBtn = () => {
        setUpdCommentBtnEffect( true );
        setTimeout( () => {
            setUpdCommentCard( !updCommentCard );
        }, 500 );
    };

    const handleDeleteComment = ( commId ) => {
        setErrMsg( '' );
        setDelCommentBtnEffect( true );
        setTimeout( async () => {
            try {
                let answer = window.confirm( 'Are you sure you want to delete this comment?' );
                if ( answer ) {
                    await axiosAuth.delete( `/posts/${ post.id }/comment/${ commId }` )
                        .then( async () => {
                            const res = await axiosAuth.get( `/posts/${ post.id }/comments` );
                            setCommentsDetail( res.data );
                            await refreshPost();
                        } )
                }
            }
            catch ( err ) {
                console.log( 'delete comment error', err );
                setErrMsg( 'Something went wrong, comment not removed.' )
                await refreshPost()
            }
        }, 600 );
    };

    const handleShare = () => {
        setShareEffect( true );


    };

    const handleShareComment = () => {
        setShareCommentBtnEffect( true );
    }

    if ( !isBrowser() ) return;
    window.addEventListener( "scroll", () => {
        document.documentElement.style.setProperty(
            "--scroll-y",
            `${ window.scrollY }px`
        );
    } );

    return (
        <>
            {/* post */ }
            <div className='p-2 mb-4 pb-6 border-b-2'>
                {/* user pic zoom overlay */ }
                { userPicZoom ? <div className='fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block' onClick={ () => hideUsrPicZoomOverlay() }>
                    <Image width={ 0 } height={ 0 } priority src={ postDetail.user.picture } alt={ `${ postDetail.user.username } picture` } placeholder='empty' className='block m-auto w-[96%] h-auto object-cover my-12 rounded-lg animate-rotateZoom' />
                </div> : <div></div> }

                {/* update post form overlay */ }
                { showForm ? <div className='fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full z-[998] bg-white block py-3'> {/* btn submit  onClick={ () => hidePostImgZoomOverlay() }*/ }
                    <form className='flex flex-col mx-auto w-[96%] h-auto z-[999] items-center text-clamp6 mt-6 mb-3' onSubmit={ handleSubmit( submitUpdateForm ) }>
                        <h1 className='text-clamp4 mb-6 uppercase'>Update your post</h1>
                        <input type='text' placeholder={ "A title..." } { ...register( "title" ) } className={ `border-2 border-appstone rounded-md h-6 my-1 drop-shadow-linkTxt w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred mb-6 ${ errors.title
                            ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.title && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.title.message }</span> }
                        <textarea type="text" placeholder='Your message...' { ...register( "content", {
                            required: 'This field is required'
                        } ) } className={ `border-2 border-appstone rounded-md my-1 drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-full h-14 resize max-w-[310px] mb-6 ${ errors.content ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.content && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mb-5'>{ errors.content.message }</span> }
                        <div className={ `relative hover:opacity-70 ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                            <input onClick={ () => setFileWiggle( true ) } type="file" name='fileUrl' placeholder='A video, image, or audio file...' { ...register( "fileUrl" ) }
                                className='border-2 border-appstone rounded-md my-1 drop-shadow-linkTxt text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[51px] h-[29px] mb-1 opacity-0 file:cursor-pointer' />
                            <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                                className='absolute left-[0px] top-[3px] -z-20' />
                            <FontAwesomeIcon icon={ faMusic } size='2x' style={ errors.fileUrl ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                                className='absolute left-[18px] top-[3px] -z-10' />
                        </div>
                        { filewatch !== null && filewatch[ 0 ] && filewatch[ 0 ]?.name &&
                            <p className={ `max-w-[300px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                        ${ errors.fileUrl ? 'text-red-600 mt-1 mb-2 bg-white underline underline-offset-2 font-semibold' : 'mb-3' }` }>
                                { filewatch[ 0 ].name }</p> }
                        { filewatch !== null && !filewatch[ 0 ]?.name && postDetail.fileUrl && <><p className='mx-3 mb-1'>No file selected</p>
                            <p className='max-w-[325px] mx-3 mb-3 text-ellipsis overflow-hidden'>Post file: { postFile }</p> </> }
                        { filewatch == null && !postDetail?.fileUrl ? <p className='mx-3 mb-3'>No file selected</p> : filewatch && !filewatch[ 0 ]?.name && !postDetail.fileUrl && <p className='mx-3 mb-3'>No file selected</p> }
                        { postDetail.fileUrl &&
                            <button type='button' title='delete file' onClick={ () => handleFileDelete() } onAnimationEnd={ () => setFileDeleteEffect( false ) }
                                className={ `mb-3 hover:opacity-60 ${ fileDeleteEffect && 'animate-reversePing' }` }>
                                <FontAwesomeIcon icon={ faFileCircleXmark } style={ { color: '#F43F5E' } } size='lg' />
                            </button>
                        }
                        { errors.fileUrl && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mb-4'>{ errors.fileUrl.message }</span> }
                        <input type="text" placeholder='A link...' { ...register( "link" ) } className={ `border-2 border-appstone rounded-md h-6 my-1 drop-shadow-linkTxt w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred mb-6 ${ errors.link ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.link && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.link.message }</span> }
                        <div className='flex w-full justify-around'>
                            <button type='button' title='reset' onClick={ () => resetBtn() } onAnimationEnd={ () => setResetUpdEffect( false ) }
                                className={ `bg-[#FF7900] text-appblck w-[38.5px] h-8 rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange ${ resetUpdEffect && 'animate-pressDown' }` }>
                                <FontAwesomeIcon icon={ faEraser } size='lg' />
                            </button>
                            <button type="submit" title='confirm update' disabled={ ttl == post.title && ctt == post.content && ( filewatch === null || !filewatch[ 0 ]?.name ) && lnk == post.link } onClick={ () => setPostUpdEffect( true ) }
                                onAnimationEnd={ () => setPostUpdEffect( false ) } className={ `bg-appstone text-white w-[38.5px] h-8 rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50 ${ postUpdEffect && 'animate-pressDown' }` }>
                                <FontAwesomeIcon icon={ faPenFancy } />
                            </button>
                        </div>
                        <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
                    </form>
                    <div className='flex justify-center'>
                        <button title='back to post' onClick={ () => cancelbackBtn() } onAnimationEnd={ () => setCancelUpdBtnEffect( false ) }
                            className={ `bg-[#FF7900] text-appblck w-9 h-8 rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange ${ cancelUpdBtnEffect && 'animate-pressDown' }` }>
                            <FontAwesomeIcon icon={ faLeftLong } size='lg' />
                        </button>
                    </div>
                </div> : <div></div> }

                {/* post card */ }
                <div className='flex justify-between'>
                    <div className='flex text-clamp6 mx-3 mt-1 touch-auto mb-2'>
                        <div className='w-7 h-7 rounded-full mr-1 border-[1px] border-gray-300 cursor-pointer transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light' onClick={ () => { showUsrPicZoomOverlay() } }>
                            <Image src={ postDetail.user.picture } width={ 0 } height={ 0 } placeholder="empty" className='rounded-full object-cover w-full h-full cursor-pointer' alt={ `${ postDetail.user.username } picture` } />
                        </div>
                        <div className='flex items-end'>
                            {/* onclick link to user[user_id] params */ }
                            { session?.user.user_id === postDetail.user_id ? <p className='mb-[5px]'>You</p> :
                                <Link href={ `/csian/${ [ postDetail.user_id ] }` } as={ `/csian/${ [ postDetail.user_id ] }` } className='mb-[5px] hover:text-appturq active:text-appturq focus:text-appturq'>{ postDetail.user.username }</Link> }
                        </div>
                    </div>
                    <div className='flex text-clamp2 font-extralight justify-center items-center text-center'>
                        { postDetail.editedAt ? ( postDetail.editedByAdmin ? <p className=''>Edited <span className='font-medium text-indigo-500'> BY ADMIN</span> { dateParser2( postDetail.editedAt ) }</p> : <p className=''>Edited { dateParser2( postDetail.editedAt ) }</p> )
                            : <p>Created { dateParser2( postDetail.createdAt ) }</p> }
                    </div>
                </div>

                { postDetail.title ? <div className=''><h2 className='text-clamp7 mx-3 font-semibold'>{ postDetail.title }</h2></div> : <div></div> }
                { postDetail.fileUrl && postDetail.fileUrl?.includes( 'image' ) && <div className='flex w-[92%] mx-auto my-3 touch-auto'>
                    <Image width={ 0 } height={ 0 } placeholder="empty" className='object-cover rounded-xl min-w-full w-full h-full' src={ postDetail.fileUrl } alt="postDetail image" />
                </div> }
                { postDetail.fileUrl && postDetail.fileUrl?.includes( 'audio' ) && <div className='flex justify-center mx-auto my-6'>
                    <audio controls className='rounded-lg'>
                        <source src={ postDetail.fileUrl } type='audio/mpeg' />
                        <source src={ postDetail.fileUrl } type='audio/ogg' />
                        <source src={ postDetail.fileUrl } type='audio/wav' />
                        Your browser does not support the audio tag.</audio>
                </div> }
                { postDetail.fileUrl && postDetail.fileUrl?.includes( 'video' ) && <div className='flex justify-center mx-auto my-6'>
                    <video id={ postDetail.id } width="full" height="250" controls >
                        <source src={ postDetail.fileUrl } type={ 'video/mp4' } />
                        <source src={ postDetail.fileUrl } type="video/ogg" />
                        <source src={ postDetail.fileUrl } type="video/webM" />
                        Your browser does not support HTML5 video. </video>
                </div> }
                { postDetail.link && <LinkVideo postLink={ postDetail.link } postid={ postDetail.id } /> }
                <div>
                    <p className='text-clamp1 mx-3 mt-2 mb-3'>{ postDetail.content }</p>
                </div>
                { session?.user.user_id === postDetail.user_id || session?.user.role === 'admin' ?
                    <div className='flex justify-evenly mb-2'>
                        {/* onclick link to post[id] params */ }
                        <div className='flex relative items-center mb-2 group'>
                            <button title='edit post' onClick={ () => modifBtn() } onAnimationEnd={ () => setModifyBtnEffect( false ) }
                                className={ `bg-appstone text-white w-fit rounded-tl-[15px] rounded-br-[15px] px-2 py-[2px] mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] ${ modifyBtnEffect && 'animate-bgSize' }` }>
                                <FontAwesomeIcon icon={ faPenToSquare } />
                            </button>
                        </div>
                        <div className='flex items-center mb-2'>
                            <button title='delete post' onClick={ () => handleDelete( post.id ) } onAnimationEnd={ () => setDeleteBtnEffect( false ) }
                                className={ `bg-appred text-white w-[30px] h-7 rounded-tl-[15px] rounded-br-[15px] mt-2 mb-2 transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:text-appblck hover:translate-y-[7px] hover:shadow-btnlred bg-[linear-gradient(#ca2401,#ca2401)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] ${ deleteBtnEffect && 'animate-bgSize' }` } >
                                <FontAwesomeIcon icon={ faTrashCan } />
                            </button>
                        </div>
                    </div> : <div></div> }
                <div className='flex justify-between'>
                    <PostLiking post={ postDetail } session={ session } />

                    {/* comment post */ }
                    <div className='mr-[48px] relative' > {/* onClick={()=>handleComment} onAnimationEnd={()=> setCommentEffect(false)} */ }
                        <span className='mr-1'>{ postDetail.discussions }</span>
                        <button title='add a comment' onClick={ () => addComment() } onAnimationEnd={ () => setCommentEffect( false ) }
                            className={ `cursor-pointer hover:opacity-50 ${ commentEffect && 'animate-resizeBtn' }` }>
                            <FontAwesomeIcon icon={ faComments } style={ { color: '#2ECEC2' } } />
                            <FontAwesomeIcon icon={ faPlus } style={ { color: '#ff20c9' } } className={ `absolute left-[26px] bottom-[9px] drop-shadow-lighter ${ commentEffect && 'opacity-0' } ` } />
                        </button>
                    </div>

                    {/* share */ }
                    <div className='mr-4'> {/* onClick={()=>handleShare} onAnimationEnd={()=> setShareEffect(false)}*/ }
                        {/* add button here with animate? */ }
                        <button title='share post'><FontAwesomeIcon icon={ faShareFromSquare } style={ { color: '#7953be' } } /></button>

                    </div>
                </div>
            </div>
            {/* new comment form overlay */ }
            { newComment && <CommentAdd post={ post } setPost={ setPostDetail } setAllComms={ setCommentsDetail } setAddComm={ setNewComment } /> }

            {/* comments */ }
            { commentsDetail.length > 0 ?
                ( commentsDetail?.map( ( comment, index ) => (
                    <div key={ comment.id } className='flex flex-col border-2 w-[94%] mx-auto my-1 rounded-xl px-3 py-1'>
                        {/* comment user pic zoom overlay */ }
                        { clickedBtn === index && userComPicZoom ? <div className='fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block' onClick={ () => hideUsrPicComZoomOverlay() }>
                            <Image width={ 0 } height={ 0 } priority src={ comment.user.picture } alt={ `${ comment.user.username } picture` } placeholder='empty' className='block m-auto w-[96%] h-auto object-cover my-12 rounded-lg animate-rotateZoom' />
                        </div> : <div></div> }
                        { clickedBtn === index && commentImgZoom ? <div className='fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block' onClick={ () => hideCommImgZoomOverlay() }>
                            <Image width={ 0 } height={ 0 } priority src={ comment.image } alt={ `${ comment.user.username }'s zoomed comment image` } placeholder='empty' className='block m-auto w-[96%] h-auto object-cover my-12 rounded-lg animate-resizeZoom' />
                        </div> : <div></div> }

                        <div className='flex justify-between'>
                            <div className='flex justify-start'>
                                <div className='rounded-full mr-1 border-[1px] border-gray-300 cursor-pointer transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light w-6 h-6' onClick={ () => { setClickedBtn( index ); showUsrPicComZoomOverlay() } }>
                                    <Image width={ 0 } height={ 0 }
                                        placeholder="empty" className='rounded-full object-cover w-full h-full cursor-pointer' src={ comment.user.picture } alt={ `${ comment.user.username } picture` } />
                                </div>
                                { session?.user.user_id === comment.user_id ? <p className=''>You</p> :
                                    <Link href={ `/csian/${ [ postDetail.user_id ] }` } as={ `/csian/${ [ postDetail.user_id ] }` } className='hover:text-appturq active:text-appturq focus:text-appturq'>{ comment.user.username }</Link> }
                            </div>
                            <div className='flex justify-around'>
                                <CommentLiking post={ post } comment={ comment } errorMsg={ setErrMsg } />
                            </div>
                        </div>
                        <div className='text-clamp6 mt-2 mb-1'>
                            <p>{ comment.message }</p>
                        </div>

                        { comment.image ? <div className='flex items-center justify-end w-[54%] h-28 self-center my-2' onClick={ () => { setClickedBtn( index ); showCommImgZoomOverlay() } }>
                            <Image width={ 0 } height={ 0 } src={ comment.image } alt='comment image' placeholder='empty'
                                className='rounded-lg object-cover w-full h-full cursor-pointer' />
                        </div> : <div></div> }

                        <div className='flex text-clamp2 font-extralight justify-between ml-10'>
                            { session?.user.user_id === comment.user_id || session?.user.role === 'admin' ? <div className=''>
                                <button title={ clickedBtn === index && updCommentCard ? 'cancel update' : 'edit' } onClick={ () => { setClickedBtn( index ); commentUpdBtn() } } onAnimationEnd={ () => setUpdCommentBtnEffect( false ) }
                                    className={ `mx-3 hover:opacity-60 ${ clickedBtn === index && updCommentBtnEffect && 'animate-resizeBtn' }` }>
                                    { clickedBtn === index && updCommentCard ? <FontAwesomeIcon icon={ faXmark } style={ { color: '#F43F5E' } } size='lg' /> : <FontAwesomeIcon icon={ faPenFancy } style={ { color: '#65A30D' } } /> }
                                </button>
                                <button title='delete' onClick={ () => { setClickedBtn( index ); handleDeleteComment( comment.id ) } } onAnimationEnd={ () => setDelCommentBtnEffect( false ) }
                                    className={ `mx-3 hover:opacity-60 ${ clickedBtn === index && delCommentBtnEffect && 'animate-resizeBtn' }` }>
                                    <FontAwesomeIcon icon={ faTrashCan } style={ { color: '#F43F5E' } } />
                                </button>
                                <button onClick={ () => { setClickedBtn( index ); handleShareComment( comment.id ) } } onAnimationEnd={ () => setShareCommentBtnEffect( false ) }
                                    className={ `mx-3 hover:opacity-60 ${ clickedBtn === index && shareCommentBtnEffect && 'animate-resizeBtn' }` }>
                                    <FontAwesomeIcon icon={ faShare } style={ { color: '#7953be' } } />
                                </button>
                            </div> : <div>
                                <button className='mx-3 hover:opacity-60'>
                                    <FontAwesomeIcon icon={ faShare } style={ { color: '#7953be' } } />
                                </button>
                            </div> }
                            <div>
                                { comment.editedAt ?
                                    ( comment.editedByAdmin ?
                                        <p>Edited <span className='font-medium text-indigo-500'> BY ADMIN</span> { dateParser2( comment.editedAt ) }</p> : <p>Edited { dateParser2( comment.editedAt ) }</p> ) :
                                    <p>Added { dateParser2( comment.createdAt ) }</p> }
                            </div>
                        </div>
                        <p className={ clickedBtn === index && errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 my-3' : 'hidden' } aria-live="assertive">{ errMsg }</p>
                        { clickedBtn === index && updCommentCard && <CommentUpdate post={ post } comment={ comment } setupdcomcard={ setUpdCommentCard } setcomments={ setCommentsDetail } /> }
                    </div>
                ) ) ) : <div>
                    <p className='text-clamp6 text-center mt-10'>No comments</p>
                </div> }
        </>
    )
}

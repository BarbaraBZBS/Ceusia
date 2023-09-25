'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { useSession, signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { logout } from '@/app/actions';
import { motion } from 'framer-motion';

const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9])/

export default function LoggedUser( { user } ) {
    const axiosAuth = useAxiosAuth();
    const { data: session, update } = useSession();
    const [ userDetail, setUserDetail ] = useState( user );
    const isBrowser = () => typeof window !== 'undefined';
    // if ( !session || session == null ) {
    //     logout();
    //     signOut( { callbackUrl: '/auth/signIn' } );
    // };
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
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            motto: '',
            picture: ''
        },
        mode: "onSubmit",
        // mode: "onBlur",
    } );
    const password = useRef( {} );
    password.current = watch( 'password', '' );
    const usrN = watch( 'username' );
    const eml = watch( 'email' );
    const psw = watch( 'password' );
    const confpasw = watch( 'confirm_password' );
    const mt = watch( 'motto' );
    const pct = watch( 'picture' );
    const [ errMsg, setErrMsg ] = useState( '' );
    const [ passwordUpdated, setPasswordUpdated ] = useState( false );
    const [ pictureUpdated, setPictureUpdated ] = useState( false );
    const [ usrnEffect, setUsrnEffect ] = useState( false );
    const [ emailEffect, setEmailEffect ] = useState( false );
    const [ pwdEffect, setPwdEffect ] = useState( false );
    const [ mottoEffect, setMottoEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ picEffect, setPicEffect ] = useState( false );
    const [ deleteEffect, setDeleteEffect ] = useState( false );
    const filewatch = watch( 'picture' );
    const [ bgZoomed, setBgZoomed ] = useState( false );

    useEffect( () => {
        if ( errors?.username ) {
            setFocus( "username" )
        }
        else if ( errors?.email ) {
            setFocus( "email" )
        }
        else if ( errors?.password ) {
            setFocus( "password" )
        }
    } );

    const submitUpdate = async ( data ) => {
        setPasswordUpdated( false );
        setPictureUpdated( false );
        setErrMsg();
        data = {
            username: getValues( 'username' ),
            email: getValues( 'email' ),
            password: getValues( 'password' ),
            motto: getValues( 'motto' )
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            await axiosAuth( {
                method: 'put',
                url: `/auth/user/${ user.id }`,
                data: data,
                headers: headers,
            } )
                .then( async ( response ) => {
                    const resData = JSON.parse( response.config.data )
                    if ( getValues( 'password' ) != '' ) {
                        setPasswordUpdated( true );
                    };
                    if ( getValues( 'username' ) != '' ) {
                        const updSession = {
                            ...session,
                            user: {
                                ...session?.user,
                                username: resData.username
                            },
                        };
                        await update( updSession )
                    };
                    const resp = await axiosAuth.get( `/auth/user/${ user.id }` )
                    const userInfo = resp.data
                    setUserDetail( userInfo )
                } );
        }
        catch ( err ) {
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            else if ( err.response?.status === 409 ) {
                setError( 'username', { type: 'custom', message: 'Username already taken' } );
                setFocus( 'username' );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'email', { type: 'custom', message: 'Email already taken' } );
                setFocus( 'email' );
            }
            else {
                setErrMsg( 'Update failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    }

    const submitPicUpdate = async ( data ) => {
        if ( data.picture <= 0 ) {
            return
        };
        const form = new FormData();
        form.append( "picture", data.picture[ 0 ] );
        console.log( 'file upload? : ', form );
        const headers = {
            "Content-Type": "multipart/form-data",
        };
        setPasswordUpdated( false );
        setPictureUpdated( false );
        setErrMsg();
        try {
            await axiosAuth( {
                method: 'post',
                url: `/auth/upload`,
                data: form,
                headers: headers
            } )
                .then( async ( response ) => {
                    if ( response ) {
                        console.log( 'response data: ', response?.data )
                        console.log( 'updated' )
                        const resp = await axiosAuth.get( `/auth/user/${ user.id }` )
                        const userInfo = resp.data
                        setUserDetail( userInfo )
                        setPictureUpdated( true )
                    };
                } )
        }
        catch ( err ) {
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            else if ( err.response?.status === 409 ) {
                setError( 'picture', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'picture', { type: 'custom', message: 'Bad file type. (video, picture or audio only)' } );
            }
            else {
                setErrMsg( 'Update failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    }

    const handleDelete = async () => {
        setPasswordUpdated( false );
        setPictureUpdated( false );
        setDeleteEffect( true );
        setErrMsg();
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            await axiosAuth( {
                method: 'delete',
                url: `/auth/user/${ user.id }`,
                headers: headers
            } )
                .then( () => {
                    console.log( 'account removed !' )
                    signOut( { callbackUrl: '/' } )
                } )
        }
        catch ( err ) {
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            else {
                setErrMsg( 'Account removal failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    }

    useEffect( () => {
        if ( isSubmitSuccessful ) {
            reset();
        }
    }, [ isSubmitSuccessful, reset ] );

    function showUsrPicZoomOverlay() {
        setBgZoomed( true );
        const scrollY = document.documentElement.style.getPropertyValue(
            "--scroll-y"
        );
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${ scrollY }`;
    };
    function hideUsrPicZoomOverlay() {
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = "";
        body.style.top = "";
        if ( !isBrowser() ) return;
        window.scrollTo( 0, parseInt( scrollY || "0" ) * -1 );
        setBgZoomed( false );
    };

    if ( !isBrowser() ) return;
    window.addEventListener( "scroll", () => {
        document.documentElement.style.setProperty(
            "--scroll-y",
            `${ window.scrollY }px`
        );
    } );

    return (
        <div className='flex flex-col'>
            {/* profile info */ }
            <h1 className='text-clamp3 text-center pt-8 mb-5 uppercase'>My Profile</h1>
            <p className={ errMsg ? 'errMsg text-clamp6 mb-2 text-center justify-center items-center' : 'offscreen' } aria-live="assertive">{ errMsg }</p>
            <div className='flex flex-col text-clamp8 items-center mb-8'>
                <p>{ userDetail.username }</p>
                <p>{ userDetail.email }</p>
                { userDetail.motto == '' || userDetail.motto == null ? <p>no motto</p> : <p className='mx-2'>{ `"${ userDetail.motto }"` }</p> }
                <p className='mb-3'>followers total / following total</p>
                <button onClick={ () => showUsrPicZoomOverlay() } className='loggedUsrPicBtn'>
                    <Image width={ 0 } height={ 0 } unoptimized={ true } src={ userDetail.picture } alt={ `${ userDetail.username } picture` } placeholder='data:image/...' className='loggedUsrPic' /></button>
                <div className={ bgZoomed ? 'usrZoomedPicOverlay' : 'hidden' } onClick={ () => hideUsrPicZoomOverlay() } >
                    { bgZoomed && <img src={ userDetail.picture } alt={ `${ userDetail.username } picture` } className='loggedUsrZoomedPic animate-resizeZoom' /> }
                </div>
            </div>

            {/* update forms */ }
            <motion.div
                animate={ { opacity: [ 0, 1 ], y: [ 50, 0 ] } }
                transition={ { duration: 0.6, delay: 0.3 } }
            >
                <div className='flex flex-col items-center'>
                    <hr className='w-[80vw] text-center mb-8 border-t-solid border-t-[4px] rounded-md border-t-gray-300'></hr>
                    <h2 className='text-clamp3 text-center mb-5 uppercase'>Update Profile Details</h2>
                </div>
                <div className='flex flex-col items-center'>
                    <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitUpdate ) }>
                        <input placeholder={ `  ${ userDetail.username }` } { ...register( "username", {
                            minLength: {
                                value: 4,
                                message: '4 characters minimum'
                            },
                            maxLength: {
                                value: 15,
                                message: '15 characters maximum'
                            },
                            pattern: {
                                value: USER_REGEX,
                                message: 'Username must start with letters (digits, -, _ allowed)'
                            }
                        } ) } className={ `user_upd_input ${ errors.username ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.username && <span className='fieldErrMsg'>{ errors.username.message }</span> }
                        <button type="submit" disabled={ !usrN } onClick={ () => setUsrnEffect( true ) } onAnimationEnd={ () => setUsrnEffect( false ) } className={ `usr_upd_btn_submit ${ usrnEffect && 'animate-bgSize' }` }>Modify Username</button>
                    </form>
                </div>

                <div className='flex flex-col items-center'>
                    <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitUpdate ) }>
                        <input type="email" placeholder={ `  ${ userDetail.email }` } { ...register( "email", {
                            pattern: {
                                value: EMAIL_REGEX,
                                message: 'Email must have a valid format'
                            }
                        } ) } className={ `user_upd_input ${ errors.email ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.email && <span className='fieldErrMsg'>{ errors.email.message }</span> }
                        <button type="submit" disabled={ !eml } onClick={ () => setEmailEffect( true ) } onAnimationEnd={ () => setEmailEffect( false ) } className={ `usr_upd_btn_submit ${ emailEffect && 'animate-bgSize' }` }>Modify Email</button>
                    </form>
                </div>

                <div>
                    <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitUpdate ) }>
                        <input type="password" placeholder="  New Password" { ...register( "password", {
                            minLength: {
                                value: 6,
                                message: '6 characters minimum'
                            },
                            maxLength: {
                                value: 35,
                                message: '35 characters maximum'
                            },
                            pattern: {
                                value: PASSWORD_REGEX,
                                message: 'Password must have at least 1 digit and 1 letter'
                            }
                        } ) } className={ `user_upd_input ${ errors.password ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.password && <span className='fieldErrMsg'>{ errors.password.message }</span> }
                        <input type="password" placeholder="  Confirm New Password" { ...register( "confirm_password", {
                            validate: value => value === password.current || "Passwords do not match",
                        } ) } className={ `user_upd_input ${ errors.confirm_password ? 'border-appred focus:border-appred' : '' }` } />
                        { errors.confirm_password && <span className='fieldErrMsg'>{ errors.confirm_password.message }</span> }
                        <div className='flex w-[45vw] justify-around items-center'>
                            <button type="submit" disabled={ !psw || !confpasw } onClick={ () => setPwdEffect( true ) } onAnimationEnd={ () => setPwdEffect( false ) } className={ `usr_upd_btn_submit ${ pwdEffect && 'animate-bgSize' }` }>Modify Password</button>
                            { passwordUpdated && <FontAwesomeIcon icon={ faCheckDouble } size={ 'xl' } style={ { color: '#84CC16' } } /> }
                        </div>
                    </form>
                </div>

                <div className='flex flex-col items-center'>
                    <form className='mb-1 py-1 flex flex-col items-center text-clamp6 w-[80%]' onSubmit={ handleSubmit( submitUpdate ) }>
                        <textarea type="text" placeholder={ userDetail.motto == '' || userDetail.motto == null ? "  Type a nice motto here..." : `  ${ userDetail.motto }` }
                            { ...register( "motto" ) } className='user_upd_input w-full h-24 resize max-w-[350px]' />
                        <button type="submit" disabled={ !mt } onClick={ () => setMottoEffect( true ) } onAnimationEnd={ () => setMottoEffect( false ) } className={ `usr_upd_btn_submit ${ mottoEffect && 'animate-bgSize' }` }>Modify Motto</button>
                    </form>
                </div>

                <div className='flex flex-col items-center'>
                    <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitPicUpdate ) }>

                        <div className={ `relative ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                            <input type="file" onClick={ () => setFileWiggle( true ) } name='picture' placeholder="  Update Profile Picture" { ...register( "picture" ) }
                                className='user_upd_input w-[51px] h-[29px] opacity-0 cursor-pointer' />
                            <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                                className='absolute left-[0px] top-[3px] -z-20' />
                            <FontAwesomeIcon icon={ faMusic } size='2x' style={ errors.picture ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                                className='absolute left-[18px] top-[3px] -z-10' />
                        </div>
                        { filewatch && filewatch[ 0 ] ?
                            <p className={ `max-w-[325px] mx-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                                ${ errors.picture ? 'text-red-600 underline underline-offset-2 font-semibold' : '' }` }>
                                { filewatch[ 0 ].name }</p> : <p className='mx-3'>No file selected</p> }
                        { errors.picture && <span className='fieldErrMsg mt-1 mb-2'>{ errors.picture.message }</span> }
                        <div className='flex w-[45vw] justify-around items-center'>
                            <button type="submit" disabled={ !pct } onClick={ () => setPicEffect( true ) } onAnimationEnd={ () => setPicEffect( false ) } className={ `usr_upd_btn_submit ${ picEffect && 'animate-bgSize' }` }>Modify Picture</button>
                            { pictureUpdated && <FontAwesomeIcon icon={ faCheckDouble } size={ 'xl' } style={ { color: '#84CC16' } } /> }
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* account suppression */ }
            <motion.div
                animate={ { opacity: [ 0, 1 ], y: [ 50, 0 ] } }
                transition={ { duration: 0.6, delay: 0.6 } }

                className='flex flex-col text-clamp5  items-center justify-center mt-8 mb-8'>
                <hr className='w-[80%] text-center mb-8 border-t-solid border-t-[4px] rounded-md border-t-gray-300'></hr>
                <h3 className='text-clamp3 text-center mb-5'>DELETE USER ACCOUNT</h3>
                <p>Want to delete your account?</p>
                <p className='uppercase'> This cannot be undone!</p>
                <button onClick={ () => handleDelete() } onAnimationEnd={ () => setDeleteEffect( false ) }
                    className={ `usr_dlt_btn_submit ${ deleteEffect && 'animate-bgSize' }` }>
                    Delete account</button>
            </motion.div>
        </div>
    )
}
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
//cannot import axiosconfig (server component) into client component
// import apiCall from '../utils/axiosConfig'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9])/


export default function LoggedUser( { user, session } ) {

    if ( user == null ) {
        router.push( '/' )
    }
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setError,
        setFocus,
        reset,
        formState: { errors, isSubmitted, isSubmitSuccessful },
    } = useForm( {
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            motto: '',
            picture: ''
        },
        mode: "onBlur"
    } );

    const router = useRouter()
    const password = useRef( {} );
    password.current = watch( 'password', '' );
    const [ load, setLoad ] = useState( false );
    const [ updateState, setUpdateState ] = useState();
    const [ errMsg, setErrMsg ] = useState( '' );
    const [ passwordUpdMsg, setPasswordUpdMsg ] = useState( '' )

    useEffect( () => {
        load && setUpdateState( 'Updating' )
    }, [ load ] )

    useEffect( () => {
        if ( errors?.username ) {
            setFocus( "username" )
        }
        else if ( errors?.email ) {
            setFocus( "email" )
        }
    } )


    const submitUpdate = async ( data ) => {
        setLoad( true )
        setPasswordUpdMsg()
        data = {
            username: getValues( 'username' ),
            email: getValues( 'email' ),
            password: getValues( 'password' ),
            motto: getValues( 'motto' )
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ session.user.token }`
        }
        try {
            await axios( {
                method: 'put',
                url: `${ process.env.NEXT_PUBLIC_API }/api/auth/user/${ user.id }`,
                data: data,
                headers: headers,
                withCredentials: true
            } )
                .then( ( response ) => {
                    console.log( response )
                    setUpdateState()
                    setLoad( false )
                    if ( getValues( 'password' ) != '' ) {
                        setPasswordUpdMsg( 'Password successfully modified!' )
                    };
                    reset();
                    router.refresh();
                } )
                .catch( ( err ) => {
                    console.log( 'upd err :', err )
                    setErrMsg( 'User profile details not updated' )
                } )
        }
        catch ( err ) {
            setLoad( false )
            setUpdateState()
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' )
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
                setErrMsg( 'Update failed, please try again.' )
            }
        }
    }

    const submitPicUpdate = async ( data ) => {
        if ( data.picture <= 0 ) {
            return
        }
        const form = new FormData();
        form.append( "picture", data.picture[ 0 ] )
        console.log( 'file upload? : ', form )
        const headers = {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${ session.user.token }`
        }
        setLoad( true )
        setPasswordUpdMsg()
        try {
            await axios( {
                method: 'post',
                url: `${ process.env.NEXT_PUBLIC_API }/api/auth/upload`,
                data: form,
                headers: headers
            } )
                .then( ( response ) => {
                    console.log( 'response data: ', response?.data )
                    console.log( 'updated' )
                    setUpdateState()
                    setLoad( false )
                    reset();
                    router.refresh();
                } )
                .catch( ( err ) => {
                    console.log( 'upd err: ', err )
                    setErrMsg( 'User profile picture not updated' )
                } )
        }
        catch ( err ) {
            setLoad( false )
            setUpdateState()
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' )
            }
            else if ( err.response?.status === 409 ) {
                setError( 'username', { type: 'custom', message: 'Max size reached' } );
                setFocus( 'username' );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'email', { type: 'custom', message: 'Bad image type' } );
                setFocus( 'email' );
            }
            else {
                setErrMsg( 'Update failed, please try again.' )
            }
        }
    }

    const handleDelete = async () => {
        setLoad( true )
        setPasswordUpdMsg()
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ session.user.token }`
        }
        try {
            await axios( {
                method: 'delete',
                url: `${ process.env.NEXT_PUBLIC_API }/api/auth/user/${ user.id }`,
                headers: headers
            } )
                .then( () => {
                    console.log( 'account removed !' )
                    signOut()
                    router.push( '/' )
                } )
                .catch( ( err ) => {
                    console.log( 'delete err: ', err )
                    setErrMsg( 'Account not deleted' )
                } )
        }
        catch ( err ) {
            setLoad( false )
            setUpdateState()
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' )
            }
            else {
                setErrMsg( 'Account removal failed, please try again.' )
            }
        }
    }

    return (
        <div>
            <h1 className='text-clamp3 text-center pt-5 mb-5 uppercase'>My Profile</h1>
            <p className={ errMsg ? 'errMsg text-clamp6 mb-2' : 'offscreen' } aria-live="assertive">{ errMsg }</p>
            <div className='flex flex-col text-clamp5 items-center mb-6'>
                <p>{ user.username }</p>
                <p>{ user.email }</p>
                { user.motto == '' || user.motto == null ? <p>no motto</p> : <p className='mx-2'>{ `"${ user.motto }"` }</p> }
                {/* followers total / following total */ }
                <Image width={ 0 } height={ 0 } unoptimized={ true } src={ user.picture } alt={ `${ user.username } picture` } className='rounded-full w-24 h-24 border-2 m-3' />
            </div>

            <div>
                <h2 className='text-clamp3 text-center mb-5 uppercase'>Update Profile Details</h2>
            </div>
            <div className='flex flex-col items-center'>
                <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitUpdate ) }>
                    <input placeholder={ `  ${ user.username }` } { ...register( "username", {
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
                    } ) } className='user_upd_input' />
                    { errors.username && <span className='fieldErrMsg'>{ errors.username.message }</span> }
                    <button type="submit" onClick={ () => setErrMsg( '' ) } className='usr_upd_btn_submit'>Modify username</button>
                </form>
            </div>

            <div className='flex flex-col items-center'>
                <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitUpdate ) }>
                    <input type="email" placeholder={ `  ${ user.email }` } { ...register( "email", {
                        pattern: {
                            value: EMAIL_REGEX,
                            message: 'Email must have a valid format'
                        }
                    } ) } className='user_upd_input' />
                    { errors.email && <span className='fieldErrMsg'>{ errors.email.message }</span> }
                    <button type="submit" onClick={ () => setErrMsg( '' ) } className='usr_upd_btn_submit'>Modify email</button>
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
                    } ) } className='user_upd_input' />
                    { errors.password && <span className='fieldErrMsg'>{ errors.password.message }</span> }
                    <input type="password" placeholder="  Confirm New Password" { ...register( "confirm_password", {
                        validate: value => value === password.current || "Passwords do not match",
                    } ) } className='user_upd_input' />
                    { errors.confirm_password && <span className='fieldErrMsg'>{ errors.confirm_password.message }</span> }
                    { updateState === 'updating' ? <p>Updating...</p> : '' }
                    <p className={ passwordUpdMsg ? 'text-clamp6 text-green-500 uppercase mt-2' : 'offscreen' }>{ passwordUpdMsg }</p>
                    <button type="submit" onClick={ () => setErrMsg( '' ) } className='usr_upd_btn_submit'>Modify password</button>
                </form>
            </div>

            <div className='flex flex-col items-center'>
                <form className='mb-1 py-1 flex flex-col items-center text-clamp6 w-[80%]' onSubmit={ handleSubmit( submitUpdate ) }>
                    <textarea type="text" placeholder={ user.motto == '' || user.motto == null ? "  Type a nice motto here..." : `  ${ user.motto }` } { ...register( "motto", {
                    } ) } className='user_upd_input w-full h-24 resize max-w-[350px]' />
                    <button type="submit" onClick={ () => setErrMsg( '' ) } className='usr_upd_btn_submit'>Modify motto</button>
                </form>
            </div>

            <div className='flex flex-col items-center'>
                <form className='mb-1 py-1 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitPicUpdate ) }>
                    <input type="file" name='picture' placeholder="  Update Profile Picture" { ...register( "picture", {
                    } ) } className='user_upd_input' />
                    { updateState === 'updating' ? <p>Updating...</p> : '' }
                    <button type="submit" onClick={ () => setErrMsg( '' ) } className='usr_upd_btn_submit'>Modify picture</button>
                </form>
            </div>


            <div className='flex flex-col text-clamp5  items-center justify-center mt-6'>
                <h3 className='text-clamp3 text-center mb-5'>DELETE USER ACCOUNT</h3>
                <p>Want to delete your account?</p>
                <p className='uppercase'> This cannot be undone!</p>
                <button onClick={ handleDelete } className='usr_upd_btn_submit bg-appred border-appred hover:bg-red-700 hover:text-white hover:border-red-700 uppercase my-5'>Delete account</button>
            </div>
        </div>

    )
}

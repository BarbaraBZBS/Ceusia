'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from 'next/link';
import Loading from './loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line max-len
const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9])/
// const USER_REGEX = /^[a-zA-Z-_]{5,10}$/
// const USER_REGEX = /(^[a-zA-Z-_]{3,3})+([A-Za-z0-9]){1,12}$/
// const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/
const REGISTER_URL = '/api/auth/signup'

export default function RegisterPage() {
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
            password: ''
        },
        mode: "onSubmit"
        // mode: "onBlur"
    } );
    const password = useRef( {} );
    password.current = watch( 'password', '' );
    const usrn = watch( 'username' );
    const eml = watch( 'email' );
    const psw = watch( 'password' );
    const [ signupState, setSignupState ] = useState();
    const [ load, setLoad ] = useState( false );
    const [ submitBtnEffect, setSubmitBtnEffect ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );
    const [ eyePEffect, setEyePEffect ] = useState( false );
    const [ eyeCPEffect, setEyeCPEffect ] = useState( false );
    const [ showPassword, setShowPassword ] = useState( false );
    const [ showConfirmPassword, setShowConfirmPassword ] = useState( false );

    useEffect( () => {
        load && setSignupState( 'Signing up' );
    }, [ load ] );

    useEffect( () => {
        if ( errors?.username ) {
            setFocus( "username" );
        }
        else if ( errors?.email ) {
            setFocus( "email" );
        }
    } );

    const submitForm = async ( data, e ) => {
        e.preventDefault();
        setErrMsg( '' );
        data = {
            username: getValues( 'username' ),
            email: getValues( 'email' ),
            password: getValues( 'password' )
        };
        setTimeout( async () => {
            setLoad( true );
            try {
                const response = await axios.post( process.env.NEXT_PUBLIC_API + REGISTER_URL,
                    JSON.stringify( data ), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                } )
                console.log( response?.data );
                setSignupState( 'Signed up' );
                setLoad( false );
                if ( isSubmitSuccessful ) {
                    reset();
                }
            }
            catch ( err ) {
                setLoad( false );
                setSignupState();
                if ( !err?.response ) {
                    setErrMsg( 'Server unresponsive, please try again or come back later.' );
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
                    setErrMsg( 'Inscription failed, please try again.' );
                }
            }
        }, 500 );
    };

    return (
        <>
            <section className='h-fit'>
                <div className='mt-12 mb-20'>
                    { signupState === 'Signing up' ? <Loading /> :
                        isSubmitSuccessful && signupState === 'Signed up' ? <p className='text-center text-clamp5 h-80'> Registered ! You can now sign in.</p> :
                            <div>
                                <p className='text-clamp7 text-center'>Already have an account ?
                                    <Link className='text-appmauvedark hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out uppercase' href='/auth/signIn' as={ '/auth/signIn' }> Sign in</Link>
                                </p>

                                <div className='border-2 border-apppastgreen rounded-xl bg-apppastgreen shadow-md m-5 h-fit'>
                                    <h1 className='text-clamp5 text-center mb-4 mt-2 uppercase'>Sign up</h1>

                                    <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6' : 'hidden' } aria-live="assertive">{ errMsg }</p>

                                    <form className='mb-3 py-2 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitForm ) }>

                                        <input placeholder="   Username" autoComplete='off' { ...register( "username", {
                                            required: 'This field is required',
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
                                        } ) } className={ `border-2 border-appstone rounded-md h-10 w-[260px] my-3 drop-shadow-linkTxt focus:border-appturq focus:outline-none focus:invalid:border-appred ${ errors.username ? 'border-appred focus:border-appred' : '' }` } />
                                        { errors.username && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.username.message }</span> }

                                        <input type="email" placeholder="   Email" { ...register( "email", {
                                            required: 'This field is required',
                                            pattern: {
                                                value: EMAIL_REGEX,
                                                message: 'Email must have a valid format'
                                            }
                                        } ) } className={ `border-2 border-appstone rounded-md h-10 w-[260px] my-3 drop-shadow-linkTxt focus:border-appturq focus:outline-none focus:invalid:border-appred ${ errors.email ? 'border-appred focus:border-appred' : '' }` } />
                                        { errors.email && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.email.message }</span> }

                                        <div className='relative'>
                                            <input type={ showPassword ? "text" : "password" } autoComplete='new-password' placeholder="   Password" { ...register( "password", {
                                                required: 'This field is required',
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
                                            } ) } className={ `border-2 border-appstone rounded-md h-10 w-[260px] my-3 drop-shadow-linkTxt focus:border-appturq focus:outline-none focus:invalid:border-appred ${ errors.password ? 'border-appred focus:border-appred' : '' }` } />
                                            <button type='button'><FontAwesomeIcon icon={ faEye } onTouchStart={ () => { setEyePEffect( true ); setShowPassword( true ) } } onTouchEnd={ () => setShowPassword( false ) }
                                                onMouseDown={ () => { setEyePEffect( true ); setShowPassword( true ) } } onMouseUp={ () => setShowPassword( false ) } onAnimationEnd={ () => setEyePEffect( false ) }
                                                className={ `absolute top-[23px] right-[5px] hover:text-appmauvelight ${ eyePEffect && 'animate-btnFlat' } ${ showPassword && 'text-appmauvedark' }` } /></button>
                                        </div>
                                        { errors.password && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.password.message }</span> }

                                        <div className='relative'>
                                            <input type={ showConfirmPassword ? "text" : "password" } autoComplete='off' placeholder="   Confirm password" { ...register( "confirm_password", {
                                                required: 'This field is required', validate: value => value === password.current || "Passwords do not match",
                                            } ) } className={ `border-2 border-appstone rounded-md h-10 w-[260px] my-3 drop-shadow-linkTxt focus:border-appturq focus:outline-none focus:invalid:border-appred ${ errors.confirm_password ? 'border-appred focus:border-appred' : '' }` } />
                                            <button type='button'><FontAwesomeIcon icon={ faEye } onTouchStart={ () => { setEyeCPEffect( true ); setShowConfirmPassword( true ) } } onTouchEnd={ () => setShowConfirmPassword( false ) }
                                                onMouseDown={ () => { setEyeCPEffect( true ); setShowConfirmPassword( true ) } } onMouseUp={ () => setShowConfirmPassword( false ) } onAnimationEnd={ () => setEyeCPEffect( false ) }
                                                className={ `absolute top-[23px] right-[5px] hover:text-appmauvelight ${ eyeCPEffect && 'animate-btnFlat' } ${ showConfirmPassword && 'text-appmauvedark' }` } /></button>
                                        </div>
                                        { errors.confirm_password && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.confirm_password.message }</span> }

                                        <button type="submit" disabled={ !usrn || !eml || !psw || !password } onClick={ () => setSubmitBtnEffect( true ) } onAnimationEnd={ () => setSubmitBtnEffect( false ) }
                                            className={ `bg-appstone text-white uppercase w-fit rounded-xl px-3 py-[3px] mt-8 mb-4 transition-all duration-300 ease-in-out hover:enabled:bg-[#ffcec9] hover:enabled:text-appblck hover:enabled:translate-y-[-7px] hover:enabled:shadow-btnpink disabled:opacity-50 ${ submitBtnEffect && 'animate-btnFlat bg-apppastgreen text-appblck' }` }>Submit</button>
                                    </form>
                                </div>
                            </div>
                    }
                </div>
            </section>
        </>
    )
}
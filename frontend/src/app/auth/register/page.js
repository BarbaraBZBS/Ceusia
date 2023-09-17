'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from 'next/link';
import Loading from './loading';


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
    const [ signupState, setSignupState ] = useState();
    const [ load, setLoad ] = useState( false );
    const [ submitBtnEffect, setSubmitBtnEffect ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );

    useEffect( () => {
        load && setSignupState( 'Signing up' );
    }, [ load ] )

    useEffect( () => {
        if ( errors?.username ) {
            setFocus( "username" );
        }
        else if ( errors?.email ) {
            setFocus( "email" );
        }
    } )

    const submitForm = async ( data, e ) => {
        e.preventDefault();
        setLoad( true );
        data = {
            username: getValues( 'username' ),
            email: getValues( 'email' ),
            password: getValues( 'password' )
        };
        try {
            const response = await axios.post( process.env.NEXT_PUBLIC_API + REGISTER_URL,
                JSON.stringify( data ), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            } )
            console.log( response?.data );
            // console.log( JSON.stringify( response ) )
            setSignupState( 'Signed up' );
            setLoad( false );
            // console.log( 'data: ', data )
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
    }

    // console.log( watch() )
    return (
        <>
            <section className='h-fit'>
                <div className='mt-12 mb-20'>
                    { signupState === 'Signing up' ? <Loading /> :
                        isSubmitSuccessful && signupState === 'Signed up' ? <p className='text-center text-clamp5 h-80'> Registered ! You can now sign in.</p> :
                            <div>
                                <p className='text-clamp7 text-center'>Already have an account ?
                                    <Link className='text-appmauvedark signLink uppercase' href='/auth/signIn'> Sign in</Link>
                                </p>

                                <div className='form_container_reg'>
                                    <h1 className='text-clamp5 text-center mb-4 mt-2 uppercase'>Sign up</h1>

                                    <p className={ errMsg ? 'errMsg text-clamp6' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

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
                                        } ) } className={ `form_input ${ errors.username ? 'border-appred focus:border-appred' : '' }` } />
                                        { errors.username && <span className='fieldErrMsg'>{ errors.username.message }</span> }

                                        <input type="email" placeholder="   Email" { ...register( "email", {
                                            required: 'This field is required',
                                            pattern: {
                                                value: EMAIL_REGEX,
                                                message: 'Email must have a valid format'
                                            }
                                        } ) } className={ `form_input ${ errors.email ? 'border-appred focus:border-appred' : '' }` } />
                                        { errors.email && <span className='fieldErrMsg'>{ errors.email.message }</span> }

                                        <input type="password" placeholder="   Password" { ...register( "password", {
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
                                        } ) } className={ `form_input ${ errors.password ? 'border-appred focus:border-appred' : '' }` } />
                                        { errors.password && <span className='fieldErrMsg'>{ errors.password.message }</span> }

                                        <input type="password" placeholder="   Confirm password" { ...register( "confirm_password", {
                                            required: 'This field is required', validate: value => value === password.current || "Passwords do not match",
                                        } ) } className={ `form_input ${ errors.confirm_password ? 'border-appred focus:border-appred' : '' }` } />
                                        { errors.confirm_password && <span className='fieldErrMsg'>{ errors.confirm_password.message }</span> }

                                        <button type="submit" onClick={ () => setSubmitBtnEffect( true ) } onAnimationEnd={ () => setSubmitBtnEffect( false ) }
                                            className={ `form_btn_submit_up ${ submitBtnEffect && 'animate-btnFlat' }` }>Submit</button>
                                    </form>
                                </div>
                            </div>
                    }
                </div>
            </section>
        </>
    )
}
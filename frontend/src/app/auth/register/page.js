"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form"
import axios from "axios";
import Link from 'next/link';


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
        formState: { errors, isSubmitted, isSubmitSuccessful },
    } = useForm( {
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
        mode: "onBlur"
    } )

    const password = useRef( {} )
    password.current = watch( 'password', '' )

    const [ signupState, setSignupState ] = useState()
    const [ load, setLoad ] = useState( false )
    const [ errMsg, setErrMsg ] = useState( '' )


    const submitForm = async ( data, e ) => {
        e.preventDefault()
        setLoad( true )
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
            console.log( response?.data )
            // console.log( JSON.stringify( response ) )
            setSignupState( 'Signed up' )
            setLoad( false )
            // console.log( 'data: ', data )
            if ( isSubmitSuccessful ) {
                reset()
            }
        }
        catch ( err ) {
            setLoad( false )
            setSignupState()
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
                setErrMsg( 'Inscription failed, please try again.' )
            }
        }
    }

    useEffect( () => {
        load && setSignupState( 'Signing up' )
    }, [ load ] )

    // console.log( watch() )
    return (
        <>
            <section>
                <div>
                    { signupState === 'Signing up' ? <p>Signing you up...</p> :
                        isSubmitSuccessful && signupState === 'Signed up' ? <p> Registered ! You can now sign in.</p> :
                            <div>
                                <h1>Sign up</h1>
                                <p>Already have an account? --&gt; <Link href='/auth/signIn'>Sign in</Link></p>

                                <p className={ errMsg ? 'errMsg' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

                                <form style={ { display: "flex", flexDirection: "column" } } onSubmit={ handleSubmit( submitForm ) }>

                                    <input placeholder="username" autoComplete='off' { ...register( "username", {
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
                                    } ) } style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                                    { errors.username && <span id='usrnErr'>{ errors.username.message }</span> }

                                    <input type="email" placeholder="email" { ...register( "email", {
                                        required: 'This field is required',
                                        pattern: {
                                            value: EMAIL_REGEX,
                                            message: 'Email must have a valid format'
                                        }
                                    } ) } style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                                    { errors.email && <span>{ errors.email.message }</span> }

                                    <input type="password" placeholder="password" { ...register( "password", {
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
                                    } ) } style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                                    { errors.password && <span>{ errors.password.message }</span> }

                                    <input type="password" placeholder="confirm password" { ...register( "confirm_password", {
                                        validate: value => value === password.current || "Passwords do not match",
                                    } ) } style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                                    { errors.confirm_password && <span>{ errors.confirm_password.message }</span> }

                                    <input type="submit" onClick={ () => setErrMsg( '' ) } />
                                </form>
                            </div>
                    }
                </div>
            </section>
        </>
    )
}
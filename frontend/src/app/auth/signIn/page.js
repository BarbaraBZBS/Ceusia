"use client";
import React, { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

export default function LogInPage() {
    const [ logState, setLogState ] = useState()
    const [ load, setLoad ] = useState( false )
    // const errRef = useRef()
    const [ errMsg, setErrMsg ] = useState( '' )
    const router = useRouter()

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setFocus,
        reset,
        formState: { errors },
    } = useForm( {
        defaultValues: {
            email: '',
            password: ''
        },
        mode: "onBlur"
    } )

    useEffect( () => {
        load && setLogState( 'Logging in' )
    }, [ load ] )

    useEffect( () => {
        if ( errMsg ) {
            setFocus( "email" )
        }
    } )

    const submitForm = async () => {
        setLoad( true );
        const result = await signIn( "credentials", {
            email: getValues( "email" ),
            password: getValues( "password" ),
            redirect: false
        } )
        if ( !result.error ) {
            router.push( '/' )
        }
        else if ( result.status == 401 ) {
            reset()
            setLoad( false )
            setLogState()
            setErrMsg( "Incorrect login details, try again or click 'Sign Up' at the top to register." )
        }
        else {
            setLoad( false )
            setLogState()
            setErrMsg( 'We were unable to log you in, please try again later.' )
            console.log( 'result error: ', result.error )
        }
    }


    // console.log( watch() ) // watch input value by passing the name of it or whole form by passing nothing
    return (
        <section>
            <div>
                { logState === 'Logging in' ? <p>Logging you in...</p> :
                    <div>
                        <h1>Sign In</h1>
                        <p className={ errMsg ? 'errMsg' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

                        <form style={ { display: "flex", flexDirection: "column" } } onSubmit={ handleSubmit( submitForm ) }>

                            <input type="email" placeholder="email" autoComplete='off' { ...register( "email", {
                                required: true,
                                onBlur: () => { if ( errMsg ) { setErrMsg( '' ) } }
                            } ) } style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                            { errors.email && <span>This field is required</span> }

                            <input type="password" placeholder="password" { ...register( "password", {
                                required: true, onBlur: () => { if ( errMsg ) { setErrMsg( '' ) } }
                            } ) } style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                            { errors.password && <span>This field is required</span> }

                            <input type="submit" />
                        </form>
                    </div>
                }
            </div>
        </section>
    )
}

'use client';
import React, { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from './loading';

export default function LogInPage() {
    const [ logState, setLogState ] = useState();
    const [ load, setLoad ] = useState( false );
    const [ errMsg, setErrMsg ] = useState( '' );

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
    } );

    useEffect( () => {
        load && setLogState( 'Logging in' );
    }, [ load ] );

    useEffect( () => {
        if ( errMsg ) {
            setFocus( "email" );
        }
    } );

    const submitForm = async () => {
        setLoad( true );
        await signIn( "credentials", {
            email: getValues( "email" ),
            password: getValues( "password" ),
            redirect: true,
            callbackUrl: '/'
        } )
            .then( ( result ) => {
                if ( result.status === 401 ) {
                    console.log( 'result: ', result )
                    reset();
                    setLoad( false );
                    setLogState();
                    setErrMsg( "Incorrect login details, try again or click 'Sign Up' at the top to register." );
                }
                else {
                    setLoad( false );
                    setLogState();
                    setErrMsg( 'We were unable to log you in, please try again later.' );
                    console.log( 'result error: ', result.error );
                }
            } )
    };


    // console.log( watch() ) // watch input value by passing the name of it or whole form by passing nothing
    return (
        <section className='h-fit'>
            <div className='mt-16 mb-40'>
                { logState === 'Logging in' ? <Loading /> :
                    <div>
                        <p className='text-clamp7 text-center'>No account yet ?
                            <Link className='text-[#DD1600] signLink uppercase' href='/auth/register'> Sign up</Link>
                        </p>
                        <div className='form_container'>
                            <h1 className='text-clamp5 text-center mb-4 mt-2 uppercase'>Sign In</h1>
                            <p className={ errMsg ? 'errMsg text-clamp6' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

                            <form className='mb-3 py-2 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitForm ) }>

                                <input type="email" placeholder="   Email" autoComplete='off' { ...register( "email", {
                                    required: true,
                                    onBlur: () => { if ( errMsg ) { setErrMsg( '' ) } }
                                } ) } className='form_input' />
                                { errors.email && <span className='fieldErrMsg'>This field is required</span> }

                                <input type="password" placeholder="   Password" { ...register( "password", {
                                    required: true, onBlur: () => { if ( errMsg ) { setErrMsg( '' ) } }
                                } ) } className='form_input' />
                                { errors.password && <span className='fieldErrMsg'>This field is required</span> }

                                <button type="submit" className='form_btn_submit_in'>Submit</button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

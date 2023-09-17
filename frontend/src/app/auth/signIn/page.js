'use client';
import React, { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from 'next/link';
import Loading from './loading';
import { useSearchParams } from 'next/navigation';

export default function LogInPage() {
    const [ logState, setLogState ] = useState();
    const [ load, setLoad ] = useState( false );
    const [ submitBtnEffect, setSubmitBtnEffect ] = useState( false );
    // const [ errMsg, setErrMsg ] = useState( '' );
    const errParams = useSearchParams()
    const error = errParams.get( 'error' );

    const {
        register,
        handleSubmit,
        getValues,
        setFocus,
        formState: { errors },
    } = useForm( {
        defaultValues: {
            email: '',
            password: ''
        },
        mode: "onSubmit"
        // mode: "onBlur"
    } );

    useEffect( () => {
        load && setLogState( 'Logging in' );
    }, [ load ] );

    useEffect( () => {
        if ( errors?.email || error ) {
            setFocus( "email" );
        }
        else if ( errors?.password ) {
            setFocus( "password" );
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
    };

    const signErrors = {
        CredentialsSignin:
            "Sign in failed. Check the details you provided are correct.",
        default: "Unable to sign in. Try again or come back later.",
    };
    const SignInError = ( { error } ) => {
        const errorMessage = error && ( signErrors[ error ] ?? signErrors.default );
        return <p className='errMsg text-clamp6 text-center' aria-live="assertive">{ errorMessage }</p>;
    };

    return (
        <section className='h-fit'>
            <div className='mt-16 mb-40'>
                { logState === 'Logging in' ? <Loading /> :
                    <div>
                        <p className='text-clamp7 text-center'>No account yet ?
                            <Link className='text-appmauvedark signLink uppercase' href='/auth/register'> Sign up</Link>
                        </p>
                        <div className='form_container'>
                            <h1 className='text-clamp5 text-center mb-4 mt-2 uppercase'>Sign In</h1>
                            { error && <SignInError error={ error } /> }

                            <form className='mb-3 py-2 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitForm ) }>

                                <input type="email" placeholder="   Email" autoComplete='off' { ...register( "email", {
                                    required: 'This field is required'
                                } ) } className={ `form_input ${ errors.email ? 'border-appred focus:border-appred' : '' }` } />
                                { errors.email && <span className='fieldErrMsg'>This field is required</span> }

                                <input type="password" placeholder="   Password" { ...register( "password", {
                                    required: 'This field is required'
                                } ) } className={ `form_input ${ errors.password ? 'border-appred focus:border-appred' : '' }` } />
                                { errors.password && <span className='fieldErrMsg'>This field is required</span> }

                                <button type="submit" onClick={ () => setSubmitBtnEffect( true ) } onAnimationEnd={ () => setSubmitBtnEffect( false ) }
                                    className={ `form_btn_submit_in ${ submitBtnEffect && 'animate-btnFlat' }` }>Submit</button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

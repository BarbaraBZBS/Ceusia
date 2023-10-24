'use client';
import React, { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from 'next/link';
import Loading from './loading';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function LogInPage() {
    const [ logState, setLogState ] = useState();
    const [ load, setLoad ] = useState( false );
    const [ submitBtnEffect, setSubmitBtnEffect ] = useState( false );
    const errParams = useSearchParams();
    const error = errParams.get( 'error' );
    const [ eyePEffect, setEyePEffect ] = useState( false );
    const [ showPassword, setShowPassword ] = useState( false );
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        setFocus,
        formState: { errors },
    } = useForm( {
        defaultValues: {
            email: '',
            password: ''
        },
        mode: "onSubmit",
    } );
    const eml = watch( 'email' );
    const psw = watch( 'password' );

    useEffect( () => {
        load && setLogState( 'Logging in' );
    }, [ load ] );

    useEffect( () => {
        if ( errors?.email ) {
            setFocus( "email" );
        }
        else if ( errors?.password ) {
            setFocus( "password" );
        }
    } );

    const submitForm = async () => {
        setTimeout( async () => {
            setLoad( true );
            await signIn( "credentials", {
                email: getValues( "email" ),
                password: getValues( "password" ),
                redirect: true,
                callbackUrl: '/'
            } )
        }, 700 )
    };

    const signErrors = {
        CredentialsSignin:
            "Sign in failed. Check the details you provided are correct.",
        default: "Unable to sign in. Try again or come back later.",
    };
    const SignInError = ( { error } ) => {
        const errorMessage = error && ( signErrors[ error ] ?? signErrors.default );
        return <p className='self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 text-center' aria-live="assertive">{ errorMessage }</p>;
    };

    return (
        <section className='h-fit'>
            <div className='mt-16 mb-40'>
                { logState === 'Logging in' ? <Loading /> :
                    <div>
                        <p className='text-clamp7 text-center'>No account yet ?
                            <Link className='text-appmauvedark hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out uppercase' href='/auth/register' as={ '/auth/register' }> Sign up</Link>
                        </p>
                        <div className='flex flex-col border-2 border-apppink rounded-xl bg-apppink shadow-md m-5 h-fit'>
                            <h1 className='text-clamp5 text-center mb-4 mt-2 uppercase'>Sign In</h1>
                            { error && <SignInError error={ error } /> }

                            <form className='mb-3 py-2 flex flex-col items-center text-clamp6' onSubmit={ handleSubmit( submitForm ) }>

                                <input type="email" placeholder="   Email" autoComplete='off' { ...register( "email", {
                                    required: 'This field is required',
                                } ) } className={ `border-2 border-appstone rounded-md h-10 w-[260px] my-3 drop-shadow-linkTxt focus:border-appturq focus:outline-none focus:invalid:border-appred ${ errors.email ? 'border-appred focus:border-appred' : '' }` } />
                                { errors.email && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>This field is required</span> }

                                <div className='relative'>
                                    <input type={ showPassword ? "text" : "password" } autoComplete='current-password' placeholder="   Password" { ...register( "password", {
                                        required: 'This field is required'
                                    } ) } className={ `border-2 border-appstone rounded-md h-10 w-[260px] my-3 drop-shadow-linkTxt focus:border-appturq focus:outline-none focus:invalid:border-appred ${ errors.password ? 'border-appred focus:border-appred' : '' }` } />
                                    <button type='button'><FontAwesomeIcon icon={ faEye } onTouchStart={ () => { setEyePEffect( true ); setShowPassword( true ) } } onTouchEnd={ () => setShowPassword( false ) }
                                        onMouseDown={ () => { setEyePEffect( true ); setShowPassword( true ) } } onMouseUp={ () => setShowPassword( false ) }
                                        onAnimationEnd={ () => setEyePEffect( false ) }
                                        className={ `absolute top-[23px] right-[5px] hover:text-appmauvelight ${ eyePEffect && 'animate-btnFlat' } ${ showPassword && 'text-appmauvedark' }` } /></button>
                                </div>
                                { errors.password && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>This field is required</span> }

                                <button type="submit" disabled={ !eml || !psw } onClick={ () => setSubmitBtnEffect( true ) } onAnimationEnd={ () => setSubmitBtnEffect( false ) }
                                    className={ `bg-appstone text-white uppercase w-fit rounded-xl px-3 py-[3px] mt-8 mb-4 transition-all duration-300 ease-in-out hover:enabled:bg-[#D9FFC5] hover:enabled:text-appblck hover:enabled:translate-y-[-7px] hover:enabled:shadow-btngreen disabled:opacity-50 ${ submitBtnEffect && 'animate-btnFlat bg-apppastgreen text-appblck' }` }>Submit</button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

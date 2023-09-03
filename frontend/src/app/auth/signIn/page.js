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
    const [ errMsg, setErrMsg ] = useState( '' );
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
        mode: "onBlur"
    } );

    useEffect( () => {
        load && setLogState( 'Logging in' );
    }, [ load ] );

    useEffect( () => {
        if ( errMsg || error ) {
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
    };

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
                            { error && <p className='errMsg text-clamp6' aria-live="assertive">{ error }</p> }

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

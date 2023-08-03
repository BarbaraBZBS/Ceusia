"use client";
import React, { useRef, useEffect, useState } from 'react';
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form"


export default function LogInPage() {
    const eMail = useRef( "" )
    const passWord = useRef( "" )

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm()

    const submitForm = async () => {
        const result = await signIn( "credentials", {
            email: getValues( "email" ),
            password: getValues( "password" ),
            redirect: true,
            callbackUrl: "/",
        } )
        console.log( 'email: ', eMail.current )
        console.log( 'password: ', passWord.current )
        console.log( 'result: ', result )
    }


    console.log( watch() ) // watch input value by passing the name of it or whole form by passing nothing
    return (
        <div>

            <form style={ { display: "flex", flexDirection: "column" } } onSubmit={ handleSubmit( submitForm ) }>
                {/* <form style={ { display: "flex", flexDirection: "column" } } onSubmit={ handleSubmit( ( data ) => {
                console.log( data )
            } ) }> */}
                <input placeholder="email" { ...register( "email", { required: true } ) }
                    style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                { errors.email && <span>This field is required</span> }

                <input placeholder="password" { ...register( "password", { required: true } ) }
                    style={ { border: "2px solid purple", borderRadius: "5px", width: "50%", height: "40px", margin: "10px" } } />
                { errors.password && <span>This field is required</span> }

                <input type="submit" />
            </form>

        </div>
    )
}

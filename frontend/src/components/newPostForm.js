'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
    const { data: session } = useSession();
    const router = useRouter();
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
            title: '',
            content: '',
            fileUrl: '',
            link: '',
        },
        mode: "onBlur"
    } );
    const [ errMsg, setErrMsg ] = useState( '' );

    useEffect( () => {
        if ( errors?.content ) {
            setFocus( "content" );
        }
    } )

    const submitForm = async ( data, e ) => {
        e.preventDefault();
        let headers;
        if ( data.fileUrl <= 0 ) {
            data = {
                title: getValues( "title" ),
                content: getValues( "content" ),
                link: getValues( "link" ),
            };
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ session.user.token }`
            };
        }
        else {
            const form = new FormData();
            form.append( "fileUrl", data.fileUrl[ 0 ] );
            form.append( "title", getValues( "title" ) );
            form.append( "content", getValues( "content" ) );
            form.append( "link", getValues( "link" ) );
            console.log( 'file upload? : ', form );
            data = form;
            headers = {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${ session.user.token }`
            };
        };
        try {
            await axios( {
                method: "post",
                url: `${ process.env.NEXT_PUBLIC_API }/api/posts`,
                data: data,
                headers: headers,
                withCredentials: true
            } )
                .then( ( response ) => {
                    console.log( response );
                    reset();
                    router.refresh();
                } )
                .catch( ( err ) => {
                    console.log( 'post err :', err )
                    setErrMsg( 'We were not able to send your post' )
                } )
        }
        catch ( err ) {
            if ( !err?.response ) {
                setErrMsg( 'Server unresponsive, please try again or come back later.' )
            }
            // else if ( err.response?.status === 409 ) {
            //     setError( 'username', { type: 'custom', message: 'Username already taken' } );
            //     setFocus( 'username' );
            // }
            // else if ( err.response?.status === 403 ) {
            //     setError( 'email', { type: 'custom', message: 'Email already taken' } );
            //     setFocus( 'email' );
            // }
            else {
                setErrMsg( 'Update failed, please try again.' )
            }
        }
    }

    return (
        <>
            <p className={ errMsg ? 'errMsg text-clamp6 mb-2' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

            {/* <div>preview?</div> */ }

            <div className='flex flex-col items-center w-full'>
                <form className='mb-1 py-1 flex flex-col items-center text-clamp6 w-full' onSubmit={ handleSubmit( submitForm ) }>

                    <input type='text' placeholder="A title..." { ...register( "title" ) } className='post_form_input' />
                    { errors.title && <span className='fieldErrMsg'>{ errors.title.message }</span> }

                    <textarea type="text" placeholder='Your message...' { ...register( "content", {
                        required: 'This field is required',
                    } ) } className='post_form_input w-full h-14 resize max-w-[350px]' />
                    { errors.content && <span className='fieldErrMsg'>{ errors.content.message }</span> }

                    <input type="file" name='fileUrl' placeholder='A video, image, or audio file...' { ...register( "fileUrl" ) }
                        className='post_form_input h-[29px]' />

                    <input type="text" placeholder='A link...' { ...register( "link" ) } className='post_form_input' />
                    { errors.link && <span className='fieldErrMsg'>{ errors.link.message }</span> }

                    <div className='flex w-full justify-around'>
                        <button onClick={ () => reset() } className='resetbtn'>Reset</button>
                        <button type="submit" onClick={ () => setErrMsg( '' ) } className='post_form_btn_submit'>Send A New Post</button>
                    </div>

                </form>
            </div>

        </>
    )
}

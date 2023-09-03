'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ModifyPost( { post } ) {
    const { data: session } = useSession();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        reset,
        formState: { errors },
    } = useForm( {
        defaultValues: {
            title: post.title,
            content: post.content,
            fileUrl: post.fileUrl,
            link: post.link,
        },
        mode: "onBlur"
    } );
    const [ errMsg, setErrMsg ] = useState( '' );

    const submitUpdateForm = async ( data, e ) => {
        e.preventDefault();
        let headers;
        // console.log( 'fileurl data ?? : ', data.fileUrl )
        if ( data.fileUrl <= 0 || data.fileUrl == null ) {
            data = {
                title: getValues( 'title' ),
                content: getValues( 'content' ),
                link: getValues( 'link' ),
            };
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ session.user.token }`
            };
            console.log( 'data : ', data )
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
            console.log( 'data: ', data )
        };
        try {
            await axios( {
                method: "put",
                url: `${ process.env.NEXT_PUBLIC_API }/api/posts/${ post.id }`,
                data: data,
                headers: headers,
                withCredentials: true
            } )
                .then( ( response ) => {
                    console.log( response );
                    router.refresh()
                    router.push( '/' );
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
            if ( err.response?.status === 409 ) {
                setError( 'file', { type: 'custom', message: 'Max size reached.' } );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'file', { type: 'custom', message: 'Bad file type.' } );
            }
            else {
                setErrMsg( 'Posting failed, please try again.' )
            }
        }
    }

    return (
        <div className='my-6 flex flex-col items-center border-apppastgreen bg-apppastgreen bg-opacity-70 border-2 w-[92%] mx-auto rounded-lg shadow-neatcard'>
            <p className={ errMsg ? 'errMsg text-clamp6 mb-2' : 'offscreen' } aria-live="assertive">{ errMsg }</p>

            <div className='flex flex-col items-center w-full'>
                <form className='mb-1 py-8 flex flex-col items-center text-clamp6 w-full' onSubmit={ handleSubmit( submitUpdateForm ) }>

                    <input type='text' placeholder="A title..." { ...register( "title" ) } className='post_form_input mb-6' />
                    { errors.title && <span className='fieldErrMsg'>{ errors.title.message }</span> }

                    <textarea type="text" placeholder='Your message...' { ...register( "content", {
                        required: 'This field is required',
                    } ) } className='post_form_input w-full h-14 resize max-w-[310px] mb-6' />
                    { errors.content && <span className='fieldErrMsg'>{ errors.content.message }</span> }

                    <input type="file" name='fileUrl' placeholder='A video, image, or audio file...' { ...register( "fileUrl" ) }
                        className='post_form_input h-[29px] mb-6' />
                    { errors.file && <span className='fieldErrMsg'>{ errors.file.message }</span> }

                    <input type="text" placeholder='A link...' { ...register( "link" ) } className='post_form_input mb-6' />
                    { errors.link && <span className='fieldErrMsg'>{ errors.link.message }</span> }

                    <div className='flex w-full justify-around'>
                        <button onClick={ () => reset() } className='resetbtn'>Cancel update</button>
                        <button type="submit" onClick={ () => setErrMsg( '' ) } className='post_form_btn_submit'>Update Post</button>
                    </div>

                </form>
            </div>

        </div>
    )
}

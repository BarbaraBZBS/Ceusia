'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm, faCheckDouble, faPenFancy, faEraser, faImagePortrait, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/

export default function CeusianDetailsModifier( props ) {
    // export default function CeusianDetailsModifier( { user, current, setuser, seterr } ) {
    const axiosAuth = useAxiosAuth();
    const isBrowser = () => typeof window !== 'undefined';
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
            motto: '',
            picture: ''
        },
        mode: "onSubmit",
    } );
    const filewatch = watch( 'picture' );
    const usrN = watch( 'username' );
    const mt = watch( 'motto' );
    const [ pictureUpdated, setPictureUpdated ] = useState( false );
    const [ usrnEffect, setUsrnEffect ] = useState( false );
    const [ mottoEffect, setMottoEffect ] = useState( false );
    const [ fileWiggle, setFileWiggle ] = useState( false );
    const [ picEffect, setPicEffect ] = useState( false );
    const [ resetBtnEffect, setResetBtnEffect ] = useState( false );
    const [ defaultPicEffect, setDefaultPicEffect ] = useState( false );

    const submitUpdate = async ( data ) => {
        setPictureUpdated( false );
        props.seterr();
        data = {
            username: getValues( 'username' ),
            motto: getValues( 'motto' )
        };
        try {
            await axiosAuth( {
                method: 'put',
                url: `/auth/user/${ props.user.id }`,
                data: data,
            } )
                .then( async () => {
                    const resp = await axiosAuth.get( `/auth/user/${ props.user.id }` );
                    props.setuser( resp.data );
                } );
        }
        catch ( err ) {
            if ( !err?.response ) {
                props.seterr( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            else if ( err.response?.status === 409 ) {
                setError( 'username', { type: 'custom', message: 'Username already taken' } );
                setFocus( 'username' );
            }
            else {
                props.seterr( 'Update failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    };

    const submitPicUpdate = async ( data ) => {
        if ( data.picture <= 0 ) {
            return
        };
        const form = new FormData();
        form.append( "picture", data.picture[ 0 ] );
        console.log( 'file upload? : ', form );
        const headers = {
            "Content-Type": "multipart/form-data",
        };
        setPictureUpdated( false );
        props.seterr();
        try {
            await axiosAuth( {
                method: 'post',
                url: `/auth/user/${ props.user.id }/upload`,
                data: form,
                headers: headers
            } )
                .then( async ( response ) => {
                    if ( response ) {
                        const resp = await axiosAuth.get( `/auth/user/${ props.user.id }` );
                        props.setuser( resp.data );
                        setPictureUpdated( true );
                    };
                } )
        }
        catch ( err ) {
            if ( !err?.response ) {
                props.seterr( 'Server unresponsive, please try again or come back later.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
            else if ( err.response?.status === 409 ) {
                setError( 'picture', { type: 'custom', message: 'Max size reached. (8Mb max)' } );
            }
            else if ( err.response?.status === 403 ) {
                setError( 'picture', { type: 'custom', message: 'Bad file type. (video, picture or audio only)' } );
            }
            else {
                props.seterr( 'Update failed, please try again.' );
                if ( !isBrowser() ) return;
                window.scrollTo( { top: 0, behavior: 'smooth' } );
            }
        }
    };

    const restoreDefault = () => {
        setDefaultPicEffect( true );
        setPictureUpdated( false );
        props.seterr();
        const data = { picture: '' };
        setTimeout( async () => {
            try {
                await axiosAuth( {
                    method: 'post',
                    url: `/auth/user/${ props.user.id }/upload`,
                    data: data,
                } )
                    .then( async ( response ) => {
                        if ( response ) {
                            console.log( 'response data: ', response.data );
                            console.log( 'updated and restored default pic' );
                            const resp = await axiosAuth.get( `/auth/user/${ props.user.id }` );
                            props.setuser( resp.data );
                            setPictureUpdated( true );
                        };
                    } )
            }
            catch ( err ) {
                if ( !err?.response ) {
                    props.seterr( 'Server unresponsive, please try again or come back later.' );
                    if ( !isBrowser() ) return;
                    window.scrollTo( { top: 0, behavior: 'smooth' } );
                }
                else {
                    props.seterr( 'Update failed, please try again.' );
                    if ( !isBrowser() ) return;
                    window.scrollTo( { top: 0, behavior: 'smooth' } );
                }
            }
        }, 700 );
    };

    useEffect( () => {
        if ( isSubmitSuccessful ) {
            reset();
        }
    }, [ isSubmitSuccessful, reset ] );

    return (
        <>
            <div className='flex flex-col items-center'>
                <hr className='w-[80vw] mb-8 border-t-solid border-t-[4px] rounded-md border-t-gray-300' />
                <h2 className='m-3 mb-5 text-center uppercase text-appred font-medium text-clamp3'>
                    Admin monitoring - if inappropriate user details</h2>
            </div>

            <div className='flex flex-col items-center'>
                <form className='mb-1 py-1 flex items-center justify-evenly text-clamp6 w-[80%]' onSubmit={ handleSubmit( submitUpdate ) }>
                    <input placeholder={ `  ${ props.current.username }` } { ...register( "username", {
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
                    } ) } className={ `border-2 border-appstone rounded-md h-8 drop-shadow-linkTxt my-1 focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${ errors.username ? 'border-appred focus:border-appred' : '' }` } />
                    <button title='confirm username update' type="submit" disabled={ !usrN } onClick={ () => setUsrnEffect( true ) } onAnimationEnd={ () => setUsrnEffect( false ) }
                        className={ `bg-appstone text-white w-[38.5px] h-8 rounded-2xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen
                        bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 ${ usrnEffect && 'animate-bgSize' }` }>
                        <FontAwesomeIcon icon={ faPenFancy } />
                    </button>
                </form>
                { errors.username && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.username.message }</span> }
            </div>

            <div className='flex flex-col items-center'>
                <form className='py-1 flex justify-evenly items-center text-clamp6 w-[80%] mb-[9px]' onSubmit={ handleSubmit( submitUpdate ) }>
                    <textarea type="text" placeholder={ props.current.motto == '' || props.current.motto == null ? "  No motto to modify" : `  ${ props.current.motto }` }
                        { ...register( "motto" ) } className='border-2 border-appstone rounded-md drop-shadow-linkTxt my-1 focus:border-apppink focus:outline-none focus:invalid:border-appred h-24 resize w-[74%]' />
                    <div className=''>
                        <button title='confirm motto update' type="submit" disabled={ !mt } onClick={ () => setMottoEffect( true ) } onAnimationEnd={ () => setMottoEffect( false ) }
                            className={ `bg-appstone text-white w-[38.5px] h-8 rounded-2xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen
                            bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 ${ mottoEffect && 'animate-bgSize' }` }>
                            <FontAwesomeIcon icon={ faPenFancy } />
                        </button>
                    </div>
                </form>
            </div>
            <div className='flex flex-col items-center'>
                <form className='py-1 flex flex-col items-center text-clamp6 w-full' onSubmit={ handleSubmit( submitPicUpdate ) }>
                    <div className='flex w-[60%] items-center justify-evenly'>
                        <div className={ `relative hover:opacity-70 ml-[16%] ${ fileWiggle && 'animate-wiggle' }` } onAnimationEnd={ () => setFileWiggle( false ) }>
                            <input type="file" onClick={ () => setFileWiggle( true ) } name='picture' placeholder="  Update Profile Picture" { ...register( "picture" ) }
                                className='border-2 border-appstone rounded-md drop-shadow-linkTxt my-1 focus:border-apppink focus:outline-none focus:invalid:border-appred w-[59px] h-10 opacity-0 file:cursor-pointer file:h-[40px]' />
                            <FontAwesomeIcon icon={ faPhotoFilm } size='2x' style={ { color: "#4E5166" } }
                                className='absolute left-[0px] top-[3px] -z-20' />
                            <FontAwesomeIcon icon={ faImagePortrait } size='2x' style={ errors.picture ? { color: "#FD2D01" } : { color: "#b1ae99" } }
                                className='absolute left-[34.5px] top-[10px] -z-10' />
                        </div>
                        <button title='confirm picture update' type="submit" disabled={ filewatch === null || !filewatch[ 0 ]?.name } onClick={ () => setPicEffect( true ) } onAnimationEnd={ () => setPicEffect( false ) }
                            className={ `bg-appstone text-white w-[38.5px] h-8 rounded-2xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen
                            bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 ml-[24%] mr-[14%] ${ picEffect && 'animate-bgSize' }` }>
                            <FontAwesomeIcon icon={ faPenFancy } />
                        </button>
                    </div>
                    { filewatch && filewatch[ 0 ] ?
                        <p className={ `max-w-[325px] mx-2 my-2 line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                                ${ errors.picture ? 'text-red-600 underline underline-offset-2 font-semibold' : '' }` }>
                            { filewatch[ 0 ].name }</p> : <p className='ml-3 mr-[6%]'>No file selected</p> }
                    { errors.picture && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md mt-1 mb-2'>{ errors.picture.message }</span> }
                    <div className='flex w-[45vw] justify-around items-center mt-1 mb-2'>
                        { pictureUpdated && <FontAwesomeIcon icon={ faCheckDouble } size={ 'xl' } style={ { color: '#84CC16' } } /> }
                    </div>
                    <button type='button' title='set to default picture' onClick={ () => restoreDefault() } onAnimationEnd={ () => setDefaultPicEffect( false ) }
                        className={ `relative self-end mr-[20%] cursor-pointer hover:opacity-70 transition-all duration-300 ease-in-out hover:translate-y-[5px] ${ defaultPicEffect && 'animate-btnFlat' }` }>
                        <FontAwesomeIcon icon={ faImagePortrait } size='xl' style={ { color: "#4E5166" } }
                            className='absolute left-[0px] top-[0px]' />
                        <FontAwesomeIcon icon={ faArrowRotateLeft } size='sm' style={ { color: "#FF7900" } }
                            className='absolute left-[11px] top-[0px]' />
                    </button>
                </form>
            </div>
            <div className='flex justify-center'>
                <button title='reset' type='button' onClick={ () => reset() } onAnimationEnd={ () => setResetBtnEffect( false ) }
                    className={ `bg-[#FF7900] text-appblck w-[38.5px] h-8 rounded-xl mb-2 mt-4 transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px]
                    hover:shadow-btnorange bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] ${ resetBtnEffect && 'animate-bgSize' }` }>
                    <FontAwesomeIcon icon={ faEraser } size='lg' />
                </button>
            </div>
        </>
    )
}

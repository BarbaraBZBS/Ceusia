import { useRef, useState, useEffect } from 'react'
// import { faCheck, faTimes, faInfoCircle, faThumbsUp, faGear } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import axios from '../../api/axios'
import Login from '../login/page'

// eslint-disable-next-line max-len
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/
const USER_REGEX = /^[a-zA-Z-_]{5,10}$/
const REGISTER_URL = '/api/auth/signup'

function Signup() {
    const userRef = useRef()
    const errRef = useRef()

    const [ username, setUserName ] = useState( '' )
    const [ validName, setValidName ] = useState( false )
    const [ userFocus, setUserFocus ] = useState( false )

    const [ email, setEmail ] = useState( '' )
    const [ validEmail, setValidEmail ] = useState( false )
    const [ emailFocus, setEmailFocus ] = useState( false )

    const [ password, setPassword ] = useState( '' )
    const [ validPwd, setValidPwd ] = useState( false )
    const [ pwdFocus, setPwdFocus ] = useState( false )

    const [ errMsg, setErrMsg ] = useState( '' )
    const [ success, setSuccess ] = useState( false )
    const [ logState, setLogState ] = useState()
    const [ load, setLoad ] = useState( false )


    useEffect( () => {
        userRef.current.focus()
    }, [] )

    useEffect( () => {
        const result = USER_REGEX.test( username )
        console.log( result )
        console.log( username )
        setValidName( result )
    }, [ username ] )

    useEffect( () => {
        const result = EMAIL_REGEX.test( email )
        console.log( result )
        console.log( email )
        setValidEmail( result )
    }, [ email ] )

    useEffect( () => {
        const result = PASSWORD_REGEX.test( password )
        console.log( result )
        console.log( password )
        setValidPwd( result )
    }, [ password ] )

    useEffect( () => {
        setErrMsg( '' )
    }, [ username, email, password ] )

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        setLoad( true )
        console.log( username, email, password )
        // if button enabled with JS hack
        const v1 = USER_REGEX.test( username )
        const v2 = PASSWORD_REGEX.test( password )
        const v3 = EMAIL_REGEX.test( email )
        if ( !v1 || !v2 || !v3 ) {
            setErrMsg( 'Informations invalides' )
            return
        }
        // try {
        //     const response = await axios.post( REGISTER_URL,
        //         JSON.stringify( { username, email, password } ),
        //         {
        //             headers: { 'Content-Type': 'application/json' },
        //             withCredentials: true
        //         }
        //     )
        //     console.log( response?.data )
        //     console.log( JSON.stringify( response ) )
        //     setSuccess( true )
        //     //clear state and controlled inputs
        //     //need value attrib on inputs for this
        //     setUserName( '' )
        //     setEmail( '' )
        //     setPassword( '' )
        // } catch ( err ) {
        //     setLoad( false )
        //     setLogState()
        //     if ( !err?.response ) {
        //         setErrMsg( 'Pas de réponse du serveur' )
        //     } else if ( err.response?.status === 409 ) {
        //         setErrMsg( 'Nom/email déja utilisé(s)' )
        //     } else {
        //         setErrMsg( 'Échec inscription' )
        //     }
        //     errRef.current.focus()
        // }
    }

    useEffect( () => {
        load && setLogState( 'Signing up' )
    }, [ load ] )


    return <>
        {/* { success ? (
            < div className='flex flex-col'>
                <div className='success flex flex-col'>
                    <h4>
                        <FontAwesomeIcon icon={ faThumbsUp } />
                        &nbsp; Inscription validée ! <br />
                        Vous pouvez vous connecter.
                    </h4>
                </div>
                <br />
                <div>
                    <Login />
                </div>
            </div>
        ) : ( */}
        <section>
            {/* <div className='logstate-container'>
                    { logState === 'Signing up' ? <FontAwesomeIcon icon={ faGear }
                        className='animate-spin text-appstone text-2xl' /> : '' }
                </div> */}
            <p ref={ errRef } className={ errMsg ? 'errMsg' : 'offscreen' } aria-live="assertive">{ errMsg }</p>
            <h1 className='title2 sm:title1 text-center'>Register</h1>
            <form className='form' onSubmit={ handleSubmit }>
                <label htmlFor="username" className='label'>
                    Username :
                    {/* <FontAwesomeIcon icon={ faCheck } className={ validName ? 'valid' : 'hidden' } />
                        <FontAwesomeIcon icon={ faTimes } className={ validName || !username ? 'hidden' : 'invalid' } /> */}
                </label>
                <input className='input'
                    type="text"
                    id="username"
                    ref={ userRef }
                    autoComplete="off"
                    onChange={ ( e ) => setUserName( e.target.value ) }
                    value={ username }
                    required
                    aria-invalid={ validName ? 'false' : 'true' }
                    aria-describedby="uidnote"
                    onFocus={ () => setUserFocus( true ) }
                    onBlur={ () => setUserFocus( false ) }
                />
                {/* <p id="uidnote" className={ userFocus && username && !validName ? 'instructions' : 'offscreen' }>
                        <FontAwesomeIcon icon={ faInfoCircle } />
                        &nbsp; 4 à 10 charactères. <br />
                        (lettres, _ , -)
                    </p> */}

                <label htmlFor="email" className='label'>
                    Email :
                    {/* <FontAwesomeIcon icon={ faCheck } className={ validEmail ? 'valid' : 'hidden' } />
                        <FontAwesomeIcon icon={ faTimes } className={ validEmail || !email ? 'hidden' : 'invalid' } /> */}
                </label>
                <input className='input'
                    type="email"
                    id="email"
                    onChange={ ( e ) => setEmail( e.target.value ) }
                    value={ email }
                    required
                    aria-invalid={ validEmail ? 'false' : 'true' }
                    aria-describedby='emailnote'
                    onFocus={ () => setEmailFocus( true ) }
                    onBlur={ () => setEmailFocus( false ) }
                />
                {/* <p id="emailnote" className={ emailFocus && !validEmail ? 'instructions' : 'offscreen' }>
                        <FontAwesomeIcon icon={ faInfoCircle } />
                        &nbsp; doit avoir un format email valide.<br />
                    </p> */}

                <label htmlFor="password" className='label'>
                    Password :
                    {/* <FontAwesomeIcon icon={ faCheck } className={ validPwd ? 'valid' : 'hidden' } />
                        <FontAwesomeIcon icon={ faTimes } className={ validPwd || !password ? 'hidden' : 'invalid' } /> */}
                </label>
                <input className='input'
                    type="password"
                    id="password"
                    onChange={ ( e ) => setPassword( e.target.value ) }
                    value={ password }
                    required
                    aria-invalid={ validPwd ? 'false' : 'true' }
                    aria-describedby='pwdnote'
                    onFocus={ () => setPwdFocus( true ) }
                    onBlur={ () => setPwdFocus( false ) }
                />
                {/* <p id="pwdnote" className={ pwdFocus && !validPwd ? 'instructions' : 'offscreen' }>
                        <FontAwesomeIcon icon={ faInfoCircle } />
                        &nbsp; 6 à 15 charactères. <br />
                        (au moins un nombre et une lettre)
                    </p> */}
                <br />
                <button className={ !validName || !validPwd || !validEmail ? 'self-center disabled' : 'btn btn:hover self-center mt-3' }>
                    Proceed</button>
            </form>
        </section>
        {/* ) } */ }
    </>
}

export default Signup

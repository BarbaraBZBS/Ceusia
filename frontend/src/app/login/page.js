import { useRef, useState, useEffect } from 'react'
// import axios from '../../api/axios'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faGear } from '@fortawesome/free-solid-svg-icons'

const LOGIN_URL = '/api/auth/login'

export default function Login() {
    const userRef = useRef()
    const errRef = useRef()

    const [ email, setEmail ] = useState( '' )
    const [ password, setPassword ] = useState( '' )
    const [ errMsg, setErrMsg ] = useState( '' )
    const [ logState, setLogState ] = useState()
    const [ load, setLoad ] = useState( false )

    useEffect( () => {
        userRef.current.focus()
    }, [] )

    useEffect( () => {
        setErrMsg( '' )
    }, [ email, password ] )

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        setLoad( true )
        console.log( email, password )
        // try {
        //     const response = await axios.post( LOGIN_URL,
        //         JSON.stringify( { email, password } ),
        //         {
        //             headers: { 'Content-Type': 'application/json' },
        //             withCredentials: true
        //         }
        //     )
        //     console.log( JSON.stringify( response?.data ) )
        //     setEmail( '' )
        //     setPassword( '' )
        //     window.location = '/'
        // } catch ( err ) {
        //     setLoad( false )
        //     setLogState()
        //     if ( !err?.response ) {
        //         console.log( err )
        //         setErrMsg( 'Pas de réponse du serveur !' )
        //     } else if ( err.response?.status === 400 ) {
        //         setErrMsg( 'email/mot de passe manquant(s) ou invalide(s)' )
        //     } else if ( err.response?.status === 401 ) {
        //         setErrMsg( 'Identifiant(s) incorrect(s)' )
        //     } else {
        //         setErrMsg( 'La connection au compte a échoué !' )
        //         console.log( err.response )
        //     }
        //     errRef.current.focus()
        // }
    }

    useEffect( () => {
        load && setLogState( 'Logging in' )
    }, [ load ] )

    return <section>
        {/* <div className='logstate-container'>
            { logState === 'Logging in' ? <FontAwesomeIcon icon={ faGear }
                className='animate-spin text-appstone text-2xl' /> : '' }
        </div> */}
        <p ref={ errRef } className={ errMsg ? 'errMsg' : 'offscreen' }
            aria-live='assertive'>{ errMsg }</p>
        <h1 className='title2 sm:title1 text-center'> Login </h1>
        <form className='form' onSubmit={ handleSubmit }>
            <label htmlFor="email" className='label'>Email</label>
            <input className='input'
                type="text"
                id='email'
                ref={ userRef }
                autoComplete='off'
                onChange={ ( e ) => setEmail( e.target.value ) }
                value={ email }
                required
            />

            <label htmlFor="password" className='label'>Password</label>
            <input className='input'
                type="password"
                id='password'
                onChange={ ( e ) => setPassword( e.target.value ) }
                value={ password }
                required
            />
            <br />
            <button className='btn btn-hover w-40 self-center mt-3'>Go</button>
        </form>
    </section>
}
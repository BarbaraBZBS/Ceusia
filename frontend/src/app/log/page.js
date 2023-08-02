'use client'

import { useState } from 'react'
import Login from '../login/page'
import Signup from '../signup/page'


export default function Log( props ) {

    const [ SignupProcess, setSignupProcess ] = useState( props.signup )
    const [ LoginProcess, setLoginProcess ] = useState( props.login )

    const handleProcess = ( e ) => {
        if ( e.target.id === 'login' ) {
            setLoginProcess( true )
            setSignupProcess( false )
        }
        else if ( e.target.id === 'signup' ) {
            setSignupProcess( true )
            setLoginProcess( false )
        }
    }

    return <section className='app'>
        <div className='log-container'>
            <div className='log'>
                <button onClick={ handleProcess } id='login'
                    className={ LoginProcess ? 'btn-active' : 'btn btn-hover' }>Login</button>
                <br />
                <button onClick={ handleProcess } id='signup'
                    className={ SignupProcess ? 'btn-active' : 'btn btn-hover' }>Signup</button>
            </div>

            { LoginProcess && <Login /> }
            { SignupProcess && <Signup /> }

        </div>
    </section>
}
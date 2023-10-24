'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import MeetFollow from './meetFollow';

export default function SuggestionsCard( props ) {
    // export default function SuggestionsCard( { meetShown, setMeetShown, setTrendShown, users, session, allFollowers, setAllFollowers, allFollowings, setAllFollowings } ) {
    const axiosAuth = useAxiosAuth();
    const [ showMeetEffect, setShowMeetEffect ] = useState( false );
    const [ hideMeetEffect, setHideMeetEffect ] = useState( false );
    const [ peopleList, setPeopleList ] = useState( [] );
    const [ errMsg, setErrMsg ] = useState( '' );

    const showMeet = () => {
        setShowMeetEffect( true );
        props.setTrendShown( false );
        setTimeout( () => {
            props.setMeetShown( true );
        }, 500 );
    };

    const hideMeet = () => {
        setHideMeetEffect( true );
        setTimeout( () => {
            props.setMeetShown( false );
        }, 500 );
    };

    useEffect( () => {
        const getPeopleList = async () => {
            let friends = [];
            let array = [];
            const res = await axiosAuth.get( `/auth/user/${ props.session.user.user_id }/following` );
            res.data.rows.map( ( usrfollowed ) => {
                friends.push( usrfollowed.user_id )
            } )
            props.users.map( async ( user ) => {
                if ( user.id !== props.session.user.user_id && !friends.includes( user.id ) ) {
                    return array.push( user );
                }
                const sortedPeople = array.sort( () => 0.5 - Math.random() )
                setPeopleList( sortedPeople )
            } )
        };
        if ( props.users[ 0 ] ) {
            getPeopleList();
        }
    }, [ props.session, props.users, props.meetShown, axiosAuth ] );

    return (
        <>
            { props.meetShown ?
                <button title='hide friends suggestion' className={ `absolute right-[-3px] top-[129px] bg-apppastgreen border-2 border-apppastgreen rounded-tl-lg rounded-bl-lg pl-2 pr-[10px] hover:text-appmauvedark ${ hideMeetEffect && 'animate-slideRight' }` }
                    onClick={ () => hideMeet() } onAnimationEnd={ () => setHideMeetEffect( false ) }>
                    <FontAwesomeIcon icon={ faChevronRight } />
                </button>
                :
                <button title='show friends suggestion' className={ `absolute right-[-7px] top-[129px] bg-apppastgreen border-2 border-apppastgreen rounded-tl-lg rounded-bl-lg pl-2 pr-[10px] hover:text-appmagenta ${ showMeetEffect && 'animate-slideLeft' }` }
                    onClick={ () => showMeet() } onAnimationEnd={ () => setShowMeetEffect( false ) }>
                    <FontAwesomeIcon icon={ faChevronLeft } />
                    <span className='text-clamp2 ml-1'>Socialize</span>
                </button>
            }
            <AnimatePresence>
                { props.meetShown && (
                    <motion.div
                        key="meet-card"
                        initial={ { opacity: 0, x: "100vw" } }
                        animate={ { opacity: 1, x: 0 } }
                        exit={ { opacity: 0, x: "100vw" } }
                        transition={ { duration: 0.6, origin: 1 } }
                        className={ `w-full border-2 bg-apppastgreen p-2 rounded-lg mt-16 ${ props.meetShown && 'flex flex-col' } ${ !props.meetShown && 'hidden' }` }>
                        <h2 className='text-center uppercase text-clamp5 mb-6'>Socialize</h2>
                        <div className='flex justify-center items-center'>
                            <p className={ errMsg ? 'self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 mb-2' : 'hidden' } aria-live="assertive">{ errMsg }</p>
                        </div>
                        { peopleList?.map( ( usr, index ) => (
                            <div key={ usr.id }>
                                <div className='flex justify-evenly my-3'>
                                    <div className='flex items-center'>
                                        <div className='w-8 h-8 rounded-full border-[1px] border-gray-300 mr-4'>
                                            <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-full object-cover w-full h-full' src={ usr.picture } alt={ `${ usr.username } picture` } />
                                        </div>
                                        <div>
                                            <p className='text-clamp7'>{ usr.username }</p>
                                        </div>
                                    </div>
                                    <MeetFollow usr={ usr } session={ props.session } setAllFollowers={ props.setAllFollowers } setAllFollowings={ props.setAllFollowings } setErrMsg={ setErrMsg } />
                                </div>
                            </div>
                        ) ) }
                    </motion.div>
                ) }
            </AnimatePresence>
        </>
    )
}

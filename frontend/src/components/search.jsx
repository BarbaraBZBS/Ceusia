'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/app/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faMagnifyingGlassArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";

export default function Search() {
    const { data: session, status } = useSession();
    const currentRoute = usePathname();
    const axiosAuth = useAxiosAuth();
    const [ searchEffect, setSearchEffect ] = useState( false );
    const [ showSearchInput, setShowSearchInput ] = useState( false );
    const [ searchBtnEffect, setSearchBtnEffect ] = useState( false );
    const [ closeSearchEffect, setCloseSearchEffect ] = useState( false );
    const [ usrsResults, setUsrsResults ] = useState( [] );
    const [ pstsResults, setPstsResults ] = useState( [] );

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
            search: '',
        },
        mode: "onSubmit",
    } );
    const src = watch( 'search' );

    const handleSearch = () => {
        setSearchEffect( true );
        setTimeout( () => {
            setShowSearchInput( true );
        }, 500 );
    };

    const handleClose = () => {
        setCloseSearchEffect( true );
        setTimeout( () => {
            setShowSearchInput( false )
        }, 500 );
    };

    const submitSearch = async () => {
        console.log( getValues( 'search' ) );
        const res = await axiosAuth.get( `/posts` );
        console.log( 'posts: ', res.data )
        const resp = await axiosAuth.get( `/auth/users` );
        console.log( 'users: ', resp.data )


        // setUsrsResults()
        // setPstsResults()
    };

    return (
        <>
            <div className={ `flex justify-end m-2` }>
                <FontAwesomeIcon icon={ faMagnifyingGlass }
                    onClick={ () => { handleSearch() } } onAnimationEnd={ () => setSearchEffect( false ) }
                    className={ `cursor-pointer hover:opacity-50 ${ searchEffect && 'animate-pressed' }` } />
            </div>

            <AnimatePresence>
                { showSearchInput &&
                    <motion.div
                        key="search-card"
                        // initial={ { opacity: 0, y: 100, x: 100 } }
                        // animate={ { opacity: 1, y: 0, x: 0 } }
                        animate={ { opacity: [ 0, 1 ], y: [ 100, 0 ], x: [ 100, 0 ] } }
                        exit={ { opacity: 0, y: 100, x: 100 } }
                        transition={ { duration: 0.4, origin: 1, delay: 0.25 } }
                        className="z-[100] w-full top-0 left-0 h-full fixed animate-pop">
                        <div className="bg-appopstone absolute top-24 left-[4.5%] p-3 w-[90%] min-h-[180px] rounded-xl shadow-neatcard overflow-auto">
                            <div className="flex justify-end">
                                <FontAwesomeIcon icon={ faXmark } size="lg" onClick={ () => handleClose() } onAnimationEnd={ () => setCloseSearchEffect( false ) }
                                    className={ `cursor-pointer hover:text-appred ${ closeSearchEffect && 'animate-pressed opacity-60' }` } />
                            </div>
                            <form onSubmit={ handleSubmit( submitSearch ) } className="flex justify-center m-4">
                                <input type='text' placeholder="Search" { ...register( "search" ) }
                                    className={ `border-2 border-appstone rounded-md h-6 mx-2 my-3 drop-shadow-linkTxt w-[70vw] text-center focus:border-apppink focus:outline-none ${ errors.search && 'border-appred focus:border-appred' }` } />
                                { errors.search && <span className='text-red-600  bg-white font-semibold drop-shadow-light px-2 rounded-md'>{ errors.search.message }</span> }
                                <button type="submit" disabled={ !src } title='search' onClick={ () => setSearchBtnEffect( true ) } onAnimationEnd={ () => setSearchBtnEffect( false ) }
                                    className={ `bg-appstone text-white w-[33px] h-8 rounded-xl mt-2 mb-2 transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50 ${ searchBtnEffect && 'animate-pressDown' }` }>
                                    <FontAwesomeIcon icon={ faMagnifyingGlassArrowRight } size='lg' />
                                </button>
                            </form>
                        </div>
                        { usrsResults || pstsResults ? <div className="">
                            <h1>Your results</h1>
                            {/* {results?.map((result, index)=> (
                        <div key={result.??}></div>
                    ))} */}
                        </div> : <div>
                            <p>Sorry no results, check spelling or make another search.</p>
                        </div> }
                    </motion.div> }
            </AnimatePresence>

        </>
    )
}

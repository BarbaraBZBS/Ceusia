'use client';
import { useState, useEffect } from "react";
import axios from "@/utils/axios";
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

export default function FollowersFollowing( { user } ) {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [ followers, setFollowers ] = useState( 0 );
    const [ following, setFollowing ] = useState( 0 );
    const [ followersListEffect, setFollowersListEffect ] = useState( false );
    const [ followingsListEffect, setFollowingsListEffect ] = useState( false );
    const [ followersShown, setFollowersShown ] = useState( false );
    const [ followingsShown, setFollowingsShown ] = useState( false );
    const [ usrFollowersList, setUsrFollowersList ] = useState( [] );
    const [ usrFollowingsList, setUsrFollowingsList ] = useState( [] );
    const [ clickedBtn, setClickedBtn ] = useState( 0 );
    const [ usrLinkEffect, setUsrLinkEffect ] = useState( false );

    useEffect( () => {
        const getFollowers = async () => {
            const res = await axios.get( `/auth/user/${ user.id }/followers` );
            setFollowers( res.data.count );
        };
        const getFollowing = async () => {
            const res = await axios.get( `/auth/user/${ user.id }/following` );
            setFollowing( res.data.count );
        };
        getFollowers();
        getFollowing();
    }, [ user.id, followers, following ] )

    function showFollowersList() {
        if ( followers !== 0 ) {
            setFollowersListEffect( true );
            let followersArray = [];
            setTimeout( async () => {
                const res = await axiosAuth.get( `/auth/user/${ user.id }/followers` );
                for ( let row of res.data.rows ) {
                    const resp = await axiosAuth.get( `/auth/user/${ row.follower_id }` );
                    followersArray.push( resp.data );
                    setUsrFollowersList( followersArray );
                }
                setFollowersShown( !followersShown )
                setFollowingsShown( false );
            }, 500 );
        }
    };

    function showFollowingsList() {
        if ( following !== 0 ) {
            setFollowingsListEffect( true );
            let followingArray = [];
            setTimeout( async () => {
                const res = await axiosAuth.get( `/auth/user/${ user.id }/following` );
                for ( let row of res.data.rows ) {
                    const resp = await axiosAuth.get( `/auth/user/${ row.user_id }` );
                    followingArray.push( resp.data );
                    setUsrFollowingsList( followingArray );
                }
                setFollowingsShown( !followingsShown );
                setFollowersShown( false );
            }, 500 );
        }
    };

    const usrProfileLnk = ( link ) => {
        setUsrLinkEffect( true );
        setTimeout( () => {
            router.push( link )
        }, 500 );
    };

    return (
        <div className="mb-6">
            <div className='mb-4 flex'>
                { followers === 1 ? <button title="show/hide my followers" onClick={ () => showFollowersList() } onAnimationEnd={ () => setFollowersListEffect( false ) }
                    className={ `rounded-xl border-2 bg-apppastgreen px-3 hover:bg-apppinklight ${ followersListEffect && 'animate-pressed' } ${ followersShown && 'border-2 border-appopred' }` }
                >{ followers } follower </button>
                    : <button title="show/hide my followers" onClick={ () => showFollowersList() } onAnimationEnd={ () => setFollowersListEffect( false ) }
                        className={ `rounded-xl border-2 bg-apppastgreen px-3 hover:bg-apppinklight ${ followersListEffect && 'animate-pressed' } ${ followersShown && 'border-2 border-appopred' }` }
                    >{ followers } followers </button> }
                &nbsp;/&nbsp; { following === 1 ? <button title="show/hide my followings" onClick={ () => showFollowingsList() } onAnimationEnd={ () => setFollowingsListEffect( false ) }
                    className={ `rounded-xl border-2 bg-apppastgreen px-3 hover:bg-apppinklight ${ followingsListEffect && 'animate-pressed' } ${ followingsShown && 'border-2 border-appopred' }` }
                > { following } following</button>
                    : <button title="show/hide my followings" onClick={ () => showFollowingsList() } onAnimationEnd={ () => setFollowingsListEffect( false ) }
                        className={ `rounded-xl border-2 bg-apppastgreen px-3 hover:bg-apppinklight ${ followingsListEffect && 'animate-pressed' } ${ followingsShown && 'border-2 border-appopred' }` }
                    > { following } followings</button> }
            </div>
            <AnimatePresence>
                { followers !== 0 && followersShown ? ( usrFollowersList?.map( ( usr, index ) => (
                    <motion.div
                        key={ usr.id }
                        initial={ { opacity: 0, x: "100vw" } }
                        animate={ { opacity: 1, x: 0 } }
                        exit={ { opacity: 0, x: "100vw" } }
                        transition={ { duration: 0.6, origin: 1 } }
                        className='w-[50%] flex justify-center mx-auto my-1 text-clamp7 items-center'>
                        <div className='w-6 h-6 rounded-full border-[1px] border-gray-300 mr-4 my-auto'>
                            <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-full object-cover w-full h-full' src={ usr.picture } alt={ `${ usr.username } picture` } />
                        </div>
                        <div>
                            <button className={ `hover:text-appturq active:text-appturq m-auto ${ clickedBtn === index && usrLinkEffect && 'animate-resizeBtn' }` }
                                onClick={ () => { setClickedBtn( index ); usrProfileLnk( `/csian/${ [ usr.id ] }` ) } }
                                onAnimationEnd={ () => setUsrLinkEffect( false ) }
                            >{ usr.username }</button>
                        </div>
                    </motion.div>
                ) ) )
                    : <div></div> }
            </AnimatePresence>
            <AnimatePresence>
                { following !== 0 && followingsShown ? ( usrFollowingsList?.map( ( usr, index ) => (
                    <motion.div
                        key={ usr.id }
                        initial={ { opacity: 0, x: "100vw" } }
                        animate={ { opacity: 1, x: 0 } }
                        exit={ { opacity: 0, x: "100vw" } }
                        transition={ { duration: 0.6, origin: 1 } }
                        className="w-[50%] flex justify-center mx-auto my-1 text-clamp7 items-center">
                        <div className='w-6 h-6 rounded-full border-[1px] border-gray-300 mr-4 my-auto'>
                            <Image width={ 0 } height={ 0 } placeholder="empty" className='rounded-full object-cover w-full h-full' src={ usr.picture } alt={ `${ usr.username } picture` } />
                        </div>
                        <div>
                            <button className={ `hover:text-appturq active:text-appturq m-auto ${ clickedBtn === index && usrLinkEffect && 'animate-resizeBtn' }` }
                                onClick={ () => { setClickedBtn( index ); usrProfileLnk( `/csian/${ [ usr.id ] }` ) } }
                                onAnimationEnd={ () => setUsrLinkEffect( false ) }
                            >{ usr.username }</button>
                        </div>
                    </motion.div>
                ) ) )
                    : <div></div> }
            </AnimatePresence>
        </div>
    )
}

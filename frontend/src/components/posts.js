import React from 'react';
import apiCall from '../utils/axiosConfig';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Image from 'next/image';
import Cards from './cards';


async function getPosts() {
    const res = await apiCall.get( '/posts' )
    if ( !res.status ) {
        console.log( 'error axios: ', error )
        throw new Error( 'Failed to fetch data' )
    }
    const data = res.data
    console.log( 'res data: ', data )
    return data
}

export default async function Posts() {
    const posts = await getPosts();
    const session = await getServerSession( authOptions );

    return (
        <>
            { session ?
                <div>
                    <div>
                        <Cards posts={ posts } session={ session } />
                    </div>
                    { !posts && <div>
                        <p>Sorry, there's no posts to display</p>
                    </div> }
                </div> : <div>
                    <p>loading...</p>
                </div>
            }
        </>
    )
}



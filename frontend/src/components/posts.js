import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { getPosts } from '@/app/lib/posts';
import { Suspense } from 'react';
import Cards from './cards';
import Loading from '../app/loading';
import axios from 'axios';
import { redirect } from 'next/navigation';

// export const revalidate = 0;

export default async function Posts() {
    const posts = await getPosts();
    const session = await getServerSession( authOptions() );
    if ( !posts || !session?.user ) {
        await axios( {
            method: 'post',
            url: '/api/auth/signout',
        } )
        redirect( '/auth/signIn' )
    };

    return (
        <>
            { session ?
                <div>
                    <Suspense fallback={ <Loading /> }>
                        <Cards posts={ posts } session={ session } />
                    </Suspense>
                </div> : <p>You seem unsigned !</p>
            }
            { !posts && <div>
                <p>Sorry, there's no posts to display</p>
            </div> }
        </>
    )
}


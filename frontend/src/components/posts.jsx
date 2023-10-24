import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { getPosts } from '@/app/lib/posts';
import { getAllUsers } from '@/app/lib/users';
import { Suspense } from 'react';
import Cards from './cards';
import Loading from '../app/loading';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions';

export default async function Posts() {

    const posts = await getPosts();
    const session = await getServerSession( authOptions() );
    if ( !posts || !session?.user ) {
        logout();
        await axios( {
            method: 'post',
            url: '/api/auth/signout',
        } )
        redirect( '/auth/signIn' )
    };
    const users = await getAllUsers();

    return (
        <>
            { session && posts &&
                <Suspense fallback={ <Loading /> }>
                    <Cards posts={ posts } users={ users } session={ session } />
                </Suspense>
            }
            { session && !posts && <div>
                <p>Sorry, there&apos;s no posts to display</p>
            </div> }
        </>
    )
}


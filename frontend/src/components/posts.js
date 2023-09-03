import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { getPosts } from '@/app/lib/posts';
import { Suspense } from 'react';
import Cards from './cards';
import Loading from '../app/loading';


export default async function Posts() {
    const posts = await getPosts();
    const session = await getServerSession( authOptions() );

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



import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Posts from '@/components/posts';
import { renderDelay } from './lib/posts';
import { Suspense } from 'react';
import Loading from './loading';

export const revalidate = 0;

export default async function Home() {
    const session = await getServerSession( authOptions() );
    // console.log( 'session: home page-- ', session );
    // await renderDelay( 2000 );
    return (
        <>
            { session && session.user ? (
                <>
                    <main className="flex flex-col items-center justify-between">
                        <Posts />
                    </main>
                </> ) : (
                <section className="h-fit pt-10 pb-28 my-16 flex flex-col items-center">
                    <div className="mt-20">
                        <h1 className="text-clamp3"> Welcome to Ceusia ! </h1>
                    </div>
                    <div className="mt-4">
                        <p className="text-clamp4"> Please sign in or register </p>
                    </div>
                </section>
            ) }
        </>
    )
}
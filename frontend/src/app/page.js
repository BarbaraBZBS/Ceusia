import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Posts from '@/components/posts';
import { Suspense } from 'react';
import Loading from './loading';
import { renderDelay } from './lib/posts';
import NewPostForm from '@/components/newPostForm';

export const revalidate = 0;

export default async function Home() {
    const session = await getServerSession( authOptions() );
    console.log( 'session: home page-- ', session )
    await renderDelay( 2000 )
    return (
        <>
            {/* <pre>{ JSON.stringify( session, null, 2 ) }</pre> */ }
            { session && session?.user ? (
                <>
                    <main className="flex min-h-screen flex-col items-center justify-between">
                        <div className="flex flex-col items-center justify-center mx-3">

                            <div className='my-8 flex flex-col items-center'>
                                <h2 className='text-clamp7'>What&apos;s on your mind?</h2>

                                <NewPostForm />
                            </div>
                            <div className='flex flex-col items-center'>
                                {/* <h3 className='text-center text-clamp5 mt-8 mb-2 uppercase'>_ Sent Lately _</h3> */ }
                                <Suspense fallback={ <Loading /> }>
                                    <Posts />
                                </Suspense>
                            </div>
                        </div>
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
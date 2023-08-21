import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Link from "next/link";
import Posts from '@/components/posts';


export default async function Home() {
    const session = await getServerSession( authOptions );
    console.log( session );

    //add isloading ?

    return (
        <>
            { session?.user ? (
                <>
                    <main className="flex min-h-screen flex-col items-center justify-between">
                        <div className="flex flex-col items-center justify-center mx-3">

                            <div>
                                <h2>What&apos;s on your mind?</h2>
                                <Image
                                    className="relative"
                                    src="/images/logo.png"
                                    alt="ceusia Logo"
                                    width={ 180 }
                                    height={ 37 }
                                    priority
                                />
                                {/* send post form component */ }
                            </div>
                            <div className='flex flex-col items-center'>
                                <h3 className='text-center text-clamp5 mt-8 mb-4'>Last posts :</h3>
                                <Posts />
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
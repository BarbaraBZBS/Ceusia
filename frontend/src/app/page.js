import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Link from "next/link";
import PostCards from '@/components/posts';


export default async function Home() {
    const session = await getServerSession( authOptions );
    console.log( session );
    // console.log( posts )
    //add isloading ?

    return (
        <>
            { session?.user ? (
                <>
                    <main className="flex min-h-screen flex-col items-center justify-between p-24">
                        <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">

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
                            <div>
                                <h3>Last posts</h3>
                                <PostCards />
                            </div>
                        </div>
                    </main>
                </> ) : (
                <>
                    <div>
                        <h1> Welcome to Ceusia ! </h1>
                    </div>
                    <div>
                        <p> Please sign in or register </p>
                    </div>
                </>
            ) }
        </>
    )
}
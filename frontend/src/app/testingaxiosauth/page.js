'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';


export default function TestPage() {
    const { data: session } = useSession();
    console.log( 'testing page session : ', session )
    const axiosAuth = useAxiosAuth()
    const [ posts, setPosts ] = useState()
    const getThemPosts = async () => {
        const res = await axiosAuth.get( "/posts" );
        setPosts( res.data )
        // setPosts( JSON.stringify( res.data ) )
    }

    // useEffect( () => {
    //     getThemPosts()
    // }, [ posts ] )

    return (
        <div>

            <button onClick={ getThemPosts }>get posts</button>
            { posts && JSON.stringify( posts ) }
            {/* { posts?.map( ( post, index, params ) => (
                <div key={ post.id } className='border-2 rounded-lg shadow-md my-5 relative'>

                    <div className=''>
                        { post.title ?
                            <h2 className='text-clamp7 text-center font-semibold border-b-2'>{ post.title }</h2> : '' }
                    </div>

                    <div>
                        <p className='line-clamp-3 text-clamp1 mx-3 my-1'>{ post.content }</p>
                    </div>

                    { post.link ? <div className='my-1 mx-2 flex justify-center'><a className=' text-[blue]' href={ post.link }>{ post.link }</a></div> : '' }

                    <div className='flex justify-center my-1'>
                        <p>{ dateParser( post.createdAt ) }</p>
                    </div>
                    { dateParser( post.updatedAt ) > dateParser( post.createdAt ) ? <p className='flex justify-center my-1'>Edited on { post.updatedAt }</p> : '' }
                </div>
            ) ) } */}

        </div>
    )
}

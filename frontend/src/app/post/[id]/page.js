import React from 'react';
import { getPost } from '@/app/lib/posts';
import ModifyPost from '@/components/postModify';

export default async function PostUpdate( { params: { id } } ) {
    console.log( 'post id ? : ', id )
    const post = await getPost( id )
    console.log( 'post ? : ', post )
    // const { data: session } = useSession();
    // const router = useRouter();
    return (
        <>
            <div className='flex flex-col py-5 my-8 min-h-[470px]'>
                <h1 className='text-clamp5 text-center uppercase'>Modify your post</h1>
                <ModifyPost post={ post } />
            </div>
        </>
    )
}
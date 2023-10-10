import { getPostComments } from "@/app/lib/posts";
import { getPost } from "@/app/lib/posts";
import PostComments from "@/components/postComments";
import { PageWrap } from '@/app/fm-wrap';

export default async function postComments( { params: { id } } ) {
    // console.log( 'post id? : ', id );
    const post = await getPost( id );
    const comments = await getPostComments( id );

    return (
        <PageWrap>
            <PostComments post={ post } comments={ comments } />
        </PageWrap>
    )
}

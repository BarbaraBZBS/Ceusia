import { getPostComments } from "@/app/lib/posts";
import { getPost } from "@/app/lib/posts";
import PostComments from "@/components/comments/postComments";
import { PageWrap } from "@/components/motions/pageWrap";

export default async function postComments({ params: { id } }) {
	const post = await getPost(id);
	const comments = await getPostComments(id);

	return (
		<PageWrap>
			<main>
				<PostComments post={post} comments={comments} />
			</main>
		</PageWrap>
	);
}

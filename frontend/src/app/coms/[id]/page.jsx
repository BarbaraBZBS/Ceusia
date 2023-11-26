import { getPostComments } from "@/lib/posts";
import { getPost } from "@/lib/posts";
import PostComments from "@/app/(components)/comments/postComments";
import { PageWrap } from "@/app/(components)/motions/pageWrap";

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

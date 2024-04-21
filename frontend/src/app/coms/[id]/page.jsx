import { getPostComments } from "@/lib/posts";
import { getPost } from "@/lib/posts";
import PostComments from "@/app/(components)/comments/postComments";
import { PageWrap } from "@/app/(components)/motions/pageWrap";
import { Suspense } from "react";

export default async function postComments({ params: { id } }) {
	const post = await getPost(id);
	const comments = await getPostComments(id);

	return (
		<PageWrap>
			<main>
				<Suspense>
					<PostComments post={post} comments={comments} />
				</Suspense>
			</main>
		</PageWrap>
	);
}

import { getPost } from "@/lib/posts";
import ModifyPost from "@/app/(components)/posts/postModify";
import { PageWrap } from "@/app/(components)/motions/pageWrap";

export default async function PostUpdate({ params: { id } }) {
	console.log("post id ? : ", id);
	const post = await getPost(id);
	console.log("post ? : ", post);
	return (
		<>
			<PageWrap>
				<main className="flex flex-col py-[2rem] my-[3.2rem] mob00:my-0 min-h-[47rem]">
					<h1 className="text-clamp5 mob88:text-clamp7 text-center uppercase font-semibold">
						Modify your post
					</h1>
					<ModifyPost post={post} />
				</main>
			</PageWrap>
		</>
	);
}

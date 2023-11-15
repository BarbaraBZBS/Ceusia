import React from "react";
import { getPost } from "@/app/lib/posts";
import ModifyPost from "@/components/posts/postModify";
import { PageWrap } from "@/components/motions/pageWrap";

export default async function PostUpdate({ params: { id } }) {
	console.log("post id ? : ", id);
	const post = await getPost(id);
	console.log("post ? : ", post);
	return (
		<>
			<PageWrap>
				<main className="flex flex-col py-[2rem] my-[3.2rem] min-h-[47rem]">
					<h1 className="text-clamp5 text-center uppercase font-semibold">
						Modify your post
					</h1>
					<ModifyPost post={post} />
				</main>
			</PageWrap>
		</>
	);
}

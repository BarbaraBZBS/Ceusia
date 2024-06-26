import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { getAllPosts } from "@/lib/posts";
import { getPosts } from "@/lib/posts";
import { getAllUsers } from "@/lib/users";
import Cards from "../(components)/posts/cards";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Thread({ searchParams }) {
	const session = await getServerSession(authOptions);
	const page = searchParams["page"] ?? "1";
	const per_page = searchParams["per_page"] ?? "6";

	//console.log("session: thread page-- ", session);
	const allPosts = await getAllPosts();
	const users = await getAllUsers();
	const postsData = await getPosts(page, per_page);
	const posts = postsData.content;
	const totalPages = postsData.totalPages;

	return (
		<div className="w-full h-full">
			<Suspense>
				<Cards
					posts={posts}
					allPosts={allPosts}
					users={users}
					session={session}
					totalPages={totalPages}
					page={page}
				/>
			</Suspense>
		</div>
	);
}

import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { getAllPosts } from "@/lib/posts";
import { getPosts } from "@/lib/posts";
import { getAllUsers } from "@/lib/users";
import Cards from "../(components)/posts/cards";

export const dynamic = "force-dynamic";

export default async function Thread({ searchParams }) {
	const session = await getServerSession(authOptions);
	const page = searchParams["page"] ?? "1";
	const per_page = searchParams["per_page"] ?? "6";

	console.log("session: thread page-- ", session);
	const allPosts = await getAllPosts();
	const users = await getAllUsers();
	const postsData = await getPosts(page, per_page);
	const posts = postsData.content;
	const totalPages = postsData.totalPages;

	return (
		<div className="w-full h-full">
			{posts.length > 0 ? (
				<>
					<Cards
						posts={posts}
						allPosts={allPosts}
						users={users}
						session={session}
						totalPages={totalPages}
						page={page}
					/>
				</>
			) : (
				<div className="flex justify-center items-center text-clamp7">
					<p>Sorry, there&apos;s no posts to display</p>
				</div>
			)}
		</div>
	);
}

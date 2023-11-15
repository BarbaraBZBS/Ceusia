import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getAllPosts } from "@/app/lib/posts";
import { getPosts } from "@/app/lib/posts";
import { getAllUsers } from "@/app/lib/users";
import Cards from "../components/posts/cards";
import PaginationController from "@/components/global/paginationController";
import { PageWrap } from "../components/motions/pageWrap";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
	const session = await getServerSession(authOptions());
	let allPosts;
	let users;
	let posts;
	let totalPages;
	const page = searchParams["page"] ?? "1";
	const per_page = searchParams["per_page"] ?? "6";

	if (session) {
		console.log("session: home page-- ", session);
		allPosts = await getAllPosts();
		users = await getAllUsers();
		const postsData = await getPosts(page, per_page);
		posts = postsData.content;
		totalPages = postsData.totalPages;
		//console.log("posts", posts, "totalpages", totalPages);
	}

	return (
		<PageWrap>
			<div className="w-full h-full">
				{session ? (
					posts.length > 0 ? (
						<>
							<Cards
								posts={posts}
								allPosts={allPosts}
								users={users}
								session={session}
							/>
							<PaginationController
								totalPages={totalPages}
								hasPrevPage={Number(page) > 1}
								hasNextPage={
									Number(page) < Number(totalPages) - 1
								}
							/>
						</>
					) : (
						<div className="flex justify-center items-center text-clamp7">
							<p>Sorry, there&apos;s no posts to display</p>
						</div>
					)
				) : (
					<section className="pt-[4rem] pb-[11.2rem] my-[6.4rem] flex flex-col items-center">
						<div className="mt-[8rem]">
							<h1 className="text-clamp3">
								{" "}
								Welcome to Ceusia !{" "}
							</h1>
						</div>
						<div className="mt-[1.6rem]">
							<p className="text-clamp4">
								{" "}
								Please sign in or register{" "}
							</p>
						</div>
					</section>
				)}
			</div>
		</PageWrap>
	);
}

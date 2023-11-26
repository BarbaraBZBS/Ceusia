import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
//import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getAllPosts } from "@/lib/posts";
import { getPosts } from "@/lib/posts";
import { getAllUsers } from "@/lib/users";
import Cards from "./(components)/posts/cards";
import PaginationController from "./(components)/global/paginationController";
import { PageWrap } from "./(components)/motions/pageWrap";
import { getStored } from "./actions";
import TimeDisplay from "./(components)/tools/timeDisplay";
import moment from "moment";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
	//const stored = getStored();
	//console.log("get stored : ", stored);
	//console.log("get stored function : ", getStored());
	const session = await getServerSession(authOptions);
	//	let allPosts;
	//	let users;
	//	let posts;
	//	let totalPages;
	//	const page = searchParams["page"] ?? "1";
	//	const per_page = searchParams["per_page"] ?? "6";
	//
	//	if (session) {
	//		console.log("session: home page-- ", session);
	//		allPosts = await getAllPosts();
	//		users = await getAllUsers();
	//		const postsData = await getPosts(page, per_page);
	//		posts = postsData.content;
	//		totalPages = postsData.totalPages;
	//		//console.log("posts", posts, "totalpages", totalPages);
	//	}

	return (
		<PageWrap>
			<div className="w-full h-full">
				{/*{session ? (
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
				) : (*/}
				<section className="pb-[11.2rem] my-[6.4rem] flex flex-col items-center gap-[2.2rem]">
					<div className="mt-[8rem]">
						<h1 className="text-clamp9 drop-shadow-linkTxt text-apppink font-bold">
							Welcome to Ceusia !
						</h1>
					</div>
					<TimeDisplay />
					<div className="flex flex-col gap-[1.7rem]">
						{/*<p className="text-clamp4">
							Please sign in or register
						</p>*/}
						{/*<p className="text-clamp4">
							Please sign in or register
						</p>*/}
						<div>
							<p className="text-clamp5 font-medium text-center">
								Let&apos;s meet and share...
							</p>
						</div>

						<nav className="m-auto cursor-pointer rounded-full w-fit border-2 border-appmauvedark text-appmauvedark bg-apppastgreen px-[1.2rem] hover:bg-apppinklight focus:border-2 focus:border-appopred shadow-neatcard transition-all duration-300 ease-in-out active:scale-125">
							<a
								href="/thread"
								className="uppercase text-clamp8 font-medium">
								home feed
							</a>
						</nav>
					</div>
				</section>
				{/*)}*/}
			</div>
		</PageWrap>
	);
}

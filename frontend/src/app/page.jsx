import { PageWrap } from "./(components)/motions/pageWrap";
import TimeDisplay from "./(components)/tools/timeDisplay";

export const dynamic = "force-dynamic";

export default async function Home() {
	return (
		<PageWrap>
			<div className="w-full h-full">
				<section className="pb-[11.2rem] my-[6.4rem] flex flex-col items-center gap-[2.2rem]">
					<div className="mt-[8rem]">
						<h1 className="text-clamp9 drop-shadow-linkTxt text-apppink font-bold">
							Welcome to Ceusia !
						</h1>
					</div>
					<TimeDisplay />
					<div className="flex flex-col gap-[1.7rem]">
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
			</div>
		</PageWrap>
	);
}

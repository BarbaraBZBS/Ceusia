import { PageWrap } from "./(components)/motions/pageWrap";
import TimeDisplay from "./(components)/tools/timeDisplay";

export default async function Home() {
	return (
		<PageWrap>
			<div className="w-full h-full">
				<section className="pb-[11.2rem] my-[6.4rem] lg:my-[10.4rem] mob88:my-[3.2rem] flex flex-col items-center gap-[2.2rem] lg:gap-[4.2rem]">
					<div className="mt-[8rem]">
						<h1 className="text-clamp9 mob88:text-clamp5 drop-shadow-linkTxt text-apppink font-bold ">
							Welcome to Ceusia !
						</h1>
					</div>
					<TimeDisplay />
					<div className="flex flex-col gap-[1.7rem]">
						<div>
							<p className="text-clamp5 mob88:text-clamp7 font-medium text-center">
								Let&apos;s meet and share...
							</p>
						</div>

						<nav
							title="Go To Posts"
							className="m-auto rounded-full w-fit border-[0.3rem] border-appmauvedark dark:border-apppastgreen text-appmauvedark bg-apppastgreen hover:bg-apppinklight dark:hover:bg-appopred dark:hover:border-appturq shadow-neatcard transition-all duration-300 ease-in-out hover:translate-y-[5px] active:scale-125 ">
							<a
								href="/thread"
								className="block m-auto px-[1.2rem] rounded-full uppercase text-clamp8 mob88:text-clamp5 font-bold focus-visible:outline-offset-[0.6rem]">
								home feed
							</a>
						</nav>
					</div>
				</section>
			</div>
		</PageWrap>
	);
}

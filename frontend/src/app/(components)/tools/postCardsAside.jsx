import TrendingCards from "../posts/trendingCards";
import SuggestionsCard from "../users/suggestionsCard";
import { useMediaQuery } from "react-responsive";

export default function PostCardsAside(props) {
	const isSmallDevice = useMediaQuery({
		query: "(max-width: 1023px)",
	});
	const isBiggerDevice = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	return (
		<>
			{isSmallDevice && (
				<aside className="relative mt-[1.6rem] flex flex-col justify-center items-end h-[5.64rem] max-h-[5.64rem]">
					<TrendingCards
						posts={props.posts}
						session={props.session}
					/>
					<SuggestionsCard
						users={props.users}
						session={props.session}
						allFollowers={props.allFollowers}
						setAllFollowers={props.setAllFollowers}
						allFollowings={props.allFollowings}
						setAllFollowings={props.setAllFollowings}
					/>
				</aside>
			)}

			{isBiggerDevice && (
				<aside className="mt-[4rem] flex flex-col items-center">
					<SuggestionsCard
						users={props.users}
						session={props.session}
						allFollowers={props.allFollowers}
						setAllFollowers={props.setAllFollowers}
						allFollowings={props.allFollowings}
						setAllFollowings={props.setAllFollowings}
					/>
					<TrendingCards
						posts={props.posts}
						session={props.session}
					/>
				</aside>
			)}
		</>
	);
}

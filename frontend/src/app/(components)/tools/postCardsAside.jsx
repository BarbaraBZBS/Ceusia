import TrendingCards from "../posts/trendingCards";
import SuggestionsCard from "../users/suggestionsCard";

export default function PostCardsAside(props) {
	return (
		<aside className="relative mt-[1.6rem] flex flex-col justify-center items-end h-[5.64rem] max-h-[5.64rem]">
			<TrendingCards posts={props.posts} session={props.session} />
			<SuggestionsCard
				users={props.users}
				session={props.session}
				allFollowers={props.allFollowers}
				setAllFollowers={props.setAllFollowers}
				allFollowings={props.allFollowings}
				setAllFollowings={props.setAllFollowings}
			/>
		</aside>
	);
}

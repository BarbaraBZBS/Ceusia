import React, { Suspense } from "react";
import { getOUser } from "@/app/lib/users";
import UserProfileCard from "@/components/users/userProfileCard";
import Loading from "../loading";
import { PageWrap } from "@/components/motions/pageWrap";

export default async function UserIdProfile({ params: { user_id } }) {
	const user = await getOUser(user_id);

	return (
		<Suspense fallback={<Loading />}>
			<PageWrap>
				<main>
					<UserProfileCard user={user} />
				</main>
			</PageWrap>
		</Suspense>
	);
}

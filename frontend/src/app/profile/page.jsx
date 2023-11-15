import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import LoggedUser from "@/components/users/loggedUser";
import { getUser } from "../lib/users";
import { Suspense } from "react";
import Loading from "./loading";
import { PageWrap } from "../../components/motions/pageWrap";

export default async function UserProfile() {
	const user = await getUser();
	const session = await getServerSession(authOptions());

	return (
		<>
			{session?.user && user ? (
				<main>
					<Suspense fallback={<Loading />}>
						<PageWrap>
							<LoggedUser user={user} />
						</PageWrap>
					</Suspense>
				</main>
			) : (
				<p>Seems like you are not logged in</p>
			)}
		</>
	);
}

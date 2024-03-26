"use client";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../loading";
import Image from "next/image";
import axios from "@/app/(utils)/axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLeftLong,
	faUserMinus,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import CeusianDetailsModifier from "./ceusianDetailsModifier";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../ChatContext";
import { FocusOn } from "react-focus-on";

export default function UserProfileCard({ user }) {
	const { data: session } = useSession();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isPicZoomed, setIsPicZoomed] = useState(false);
	const isBrowser = () => typeof window !== "undefined";
	const [followed, setFollowed] = useState(false);
	const [followingUsr, setFollowingUsr] = useState(false);
	const [followEffect, setFollowEffect] = useState(false);
	const [unfollowEffect, setUnfollowEffect] = useState(false);
	const [backBtnEffect, setBackBtnEffect] = useState(false);
	const [followers, setFollowers] = useState(0);
	const [following, setFollowing] = useState(0);
	const [errMsg, setErrMsg] = useState(false);
	const [usr, setUsr] = useState(user);
	const searchParams = useSearchParams();
	const postId = searchParams.get("pi") ?? null;
	const pg = searchParams.get("pg") ?? "1";
	const { onlineUsers } = useContext(ChatContext);
	const isOnline = onlineUsers.some((usr) => {
		return usr?.userId === user?.id;
	});
	const { socket } = useContext(ChatContext);

	useEffect(() => {
		if (usr) {
			setIsLoading(false);
		}
	}, [usr]);

	function showUsrPicZoomOverlay() {
		setIsPicZoomed(true);
		const scrollY =
			document.documentElement.style.getPropertyValue("--scroll-y");
		const body = document.body;
		body.style.position = "fixed";
		body.style.top = `-${scrollY}`;
	}
	function hideUsrPicZoomOverlay() {
		const body = document.body;
		const scrollY = body.style.top;
		body.style.position = "";
		body.style.top = "";
		if (!isBrowser()) return;
		window.scrollTo(0, parseInt(scrollY || "0") * -1);
		setIsPicZoomed(false);
	}

	useEffect(() => {
		const getFollowers = async () => {
			const res = await axios.get(`/auth/user/${user.id}/followers`);
			setFollowers(res.data.count);
		};
		const getFollowing = async () => {
			const res = await axios.get(`/auth/user/${user.id}/following`);
			setFollowing(res.data.count);
		};
		getFollowers();
		getFollowing();
	}, [user.id, followers, following, followed, followingUsr]);

	useEffect(() => {
		const checkFollowedStatus = async () => {
			const data = {
				user_id: user.id,
				follower_id: session.user.user_id,
			};
			const res = await axios({
				method: "post",
				url: "/auth/followstatus",
				data: data,
			});
			const status = res.data.message;
			// console.log( 'res foll status : ', status );
			if (status === "followed") setFollowed(true);
		};

		const checkFollowingStatus = async () => {
			const data = {
				user_id: session?.user?.user_id,
				follower_id: user?.id,
			};
			const res = await axios({
				method: "post",
				url: "/auth/followstatus",
				data: data,
			});
			const status = res.data.message;
			// console.log( 'res foll status : ', status );
			if (status === "followed") setFollowingUsr(true);
		};
		checkFollowedStatus();
		checkFollowingStatus();
	}, [session?.user.user_id, user.id, followed, followingUsr]);

	const handleFollow = () => {
		setFollowEffect(true);
		const data = {
			follower_id: session.user.user_id,
		};
		setTimeout(async () => {
			try {
				await axios({
					method: "post",
					url: `/auth/follow/${user.id}`,
					data: data,
				});
				setFollowed(true);

				socket.current.emit("follow", {
					sender_id: session?.user?.user_id,
					user_id: user.id,
				});
			} catch (err) {
				if (!err?.response) {
					console.log(err);
					setErrMsg("No response.");
					setTimeout(() => {
						setErrMsg("");
					}, 4000);
				} else {
					console.log(err);
					setErrMsg("Following failed.");
					setTimeout(() => {
						setErrMsg("");
					}, 4000);
				}
			}
		}, 700);
	};

	const handleUnfollow = () => {
		setUnfollowEffect(true);
		const data = {
			follower_id: session.user.user_id,
		};
		setTimeout(async () => {
			try {
				await axios({
					method: "post",
					url: `/auth/unfollow/${user.id}`,
					data: data,
				});
				setFollowed(false);
			} catch (err) {
				if (!err?.response) {
					console.log(err);
					setErrMsg("No response.");
					setTimeout(() => {
						setErrMsg("");
					}, 4000);
				} else {
					console.log(err);
					setErrMsg("Unfollowing failed.");
					setTimeout(() => {
						setErrMsg("");
					}, 4000);
				}
			}
		}, 700);
	};

	const goBackLink = () => {
		setBackBtnEffect(true);
		if (!postId) {
			router.back();
		}
	};

	if (!isBrowser()) return;
	window.addEventListener("scroll", () => {
		document.documentElement.style.setProperty(
			"--scroll-y",
			`${window.scrollY}px`
		);
	});

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<div className="relative flex flex-col justify-center items-center pt-[3.2rem] pb-[4rem] lg:pt-[5rem] lg:pb-[6rem] mt-[4rem] lg:mt-[7rem] mb-[5.6rem] min-h-[40rem] border-2 border-gray-900/10 dark:border-applightdark bg-apppastgreen dark:bg-applightdark bg-opacity-30 rounded-lg shadow-lg w-[90%] lg:w-[60%] mx-auto">
						<div>
							<h1 className="max-w-[96%] text-balance text-clamp3 mob88:text-clamp5 text-center uppercase pb-[1.6rem] lg:pb-[4rem] font-semibold">
								Viewing {usr.username} profile
							</h1>
						</div>

						<div>
							{usr.motto == "" || usr.motto == null ? (
								<p className="text-clamp8 pb-[1.6rem]">
									{usr.username} has no motto
								</p>
							) : (
								<p className="text-clamp5 mob88:text-clamp7 mb-[1.2rem] mx-[1.2rem] text-center">{` ${usr.motto} `}</p>
							)}
						</div>
						{followed && followingUsr && (
							<div
								className={`inline-block h-[2.2rem] w-[2.2rem] rounded-[50%] absolute z-[2] top-[16.5rem] left-[9.6rem] mob88:left-[19%] mob88:top-[31%] sm:left-[32%] lg:top-[22.5rem] lg:left-[32%]
							${isOnline ? "bg-[#0CDA0B]" : "bg-gray-500"}
							`}></div>
						)}

						<button
							title="click or press enter to zoom in"
							className="flex justify-center items-center w-[14rem] h-[14rem] rounded-full relative mb-[2rem] transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light focus-visible:outline-offset-[0.4rem]"
							onClick={() => showUsrPicZoomOverlay()}
							onKeyUp={(e) => {
								if (e.key === "Enter") showUsrPicZoomOverlay();
							}}>
							<Image
								aria-description="click or press enter to zoom in"
								title={`${usr.username} picture`}
								width={0}
								height={0}
								priority={true}
								src={`${process.env.NEXT_PUBLIC_API}${usr.picture}`}
								alt={`${usr.username} picture`}
								placeholder="empty"
								className="rounded-full object-cover w-full h-full cursor-pointer shadow-strip focus-visible:outline-8"
							/>
						</button>
						{isPicZoomed && (
							<FocusOn
								onEscapeKey={() => {
									hideUsrPicZoomOverlay();
								}}>
								<div
									className={
										isPicZoomed
											? "fixed overflow-y-auto left-0 right-0 top-0 bottom-0 w-screen h-full bg-white dark:bg-appblck z-[998] flex"
											: "hidden"
									}
									onClick={() => hideUsrPicZoomOverlay()}>
									{isPicZoomed && (
										<Image
											tabIndex={0}
											title="click or press escape to zoom out"
											width={0}
											height={0}
											priority={true}
											placeholder="empty"
											src={`${process.env.NEXT_PUBLIC_API}${usr.picture}`}
											alt={`zoomed in ${usr.username} picture`}
											className="block m-auto w-[96%] border-4 aspect-square object-cover rounded-full animate-resizeZoom"
										/>
									)}
								</div>
							</FocusOn>
						)}

						{followed ? (
							<div>
								<p className="text-clamp8 pt-[0.4rem] text-appmauvedark dark:text-apppastgreen">
									{" "}
									You follow {usr.username}.
								</p>
							</div>
						) : (
							<div className="text-clamp8 pt-[0.4rem] text-gray-400 dark:text-appopstone">
								{" "}
								You don&apos;t follow {usr.username}.
							</div>
						)}
						{followingUsr ? (
							<div>
								<p className="text-clamp8 pb-[1.2rem] text-appmagenta dark:text-appopred">
									{" "}
									{usr.username} follows you.
								</p>
							</div>
						) : (
							<div className="text-clamp8 pb-[1.2rem] text-gray-400 dark:text-appopstone">
								{usr.username} does not follow you.
							</div>
						)}
						<div className="text-clamp8 flex pb-[1.6rem]">
							{followers === 1 ? (
								<p className="mb-[1.2rem]">
									{" "}
									{followers} follower / {following} following
								</p>
							) : (
								<p className="mb-[1.2rem]">
									{" "}
									{followers} followers / {following}{" "}
									following
								</p>
							)}
						</div>

						<div className="flex w-[80%] items-center justify-evenly">
							<nav
								className={`flex cursor-pointer items-center justify-center bg-[#FF7900] text-appblck rounded-xl my-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
									backBtnEffect &&
									"animate-pressDown bg-apppastgreen"
								}`}
								title={
									postId
										? "back to the post"
										: "back to previous page"
								}
								onClick={() => goBackLink()}
								onAnimationEnd={() => setBackBtnEffect(false)}>
								<a
									href={
										postId
											? `/thread?page=${pg}&per_page=6#${postId}`
											: "#"
									}
									className="flex w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl text-center justify-center items-center">
									<FontAwesomeIcon
										icon={faLeftLong}
										size="2xl"
									/>
								</a>
							</nav>
							{followed ? (
								<div className="">
									<button
										title="unfollow user"
										onClick={() => handleUnfollow()}
										onAnimationEnd={() =>
											setUnfollowEffect(false)
										}
										className={`bg-appstone dark:bg-appmauvedark text-clamp6 mob88:text-[1.4rem] text-white w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue shadow-neatcard ${
											unfollowEffect &&
											"animate-btnFlat text-appblck bg-apppastgreen"
										}`}>
										<FontAwesomeIcon icon={faUserMinus} />
									</button>
								</div>
							) : (
								<div>
									<button
										title="follow user"
										onClick={() => handleFollow()}
										onAnimationEnd={() =>
											setFollowEffect(false)
										}
										className={`bg-appstone dark:bg-appmauvedark text-clamp6  mob88:text-[1.4rem] text-white w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue shadow-neatcard ${
											followEffect &&
											"animate-btnFlat text-appblck bg-apppastgreen"
										}`}>
										<FontAwesomeIcon icon={faUserPlus} />
									</button>
								</div>
							)}
						</div>
						<AnimatePresence>
							{errMsg && (
								<motion.p
									initial={{
										x: 70,
										opacity: 0,
									}}
									animate={{
										x: 0,
										opacity: 1,
									}}
									exit={{
										x: 70,
										opacity: 0,
									}}
									transition={{
										type: "popLayout",
									}}
									className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 my-[1.2rem]"
									role="alert"
									aria-live="assertive">
									{errMsg}
								</motion.p>
							)}
						</AnimatePresence>
					</div>

					{session?.user.role === "admin" ? (
						<div className="mb-[4rem]">
							<CeusianDetailsModifier
								user={user}
								current={usr}
								setuser={setUsr}
								seterr={setErrMsg}
							/>
						</div>
					) : (
						<div></div>
					)}
				</>
			)}
		</>
	);
}

"use client";
import React, { useState, useEffect } from "react";
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
					<div className="flex flex-col justify-center items-center pt-[3.2rem] pb-[4rem] mt-[4rem] mb-[5.6rem] min-h-[40rem] border-gray-900 bg-apppastgreen bg-opacity-30 rounded-lg shadow-lg w-[90%] mx-auto">
						<div>
							<h1 className="text-clamp3 text-center uppercase pb-[1.6rem] font-semibold">
								Viewing {usr.username} profile
							</h1>
						</div>

						<div>
							{usr.motto == "" || usr.motto == null ? (
								<p className="text-clamp8 pb-[1.6rem]">
									{usr.username} has no motto
								</p>
							) : (
								<p className="text-clamp5 mb-[1.2rem]">{`"${usr.motto}"`}</p>
							)}
						</div>
						<div
							className="flex justify-center items-center w-[14rem] h-[14rem] rounded-full relative mb-[2rem] transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light"
							onClick={() => showUsrPicZoomOverlay()}>
							<Image
								title={`zoom ${usr.username} picture`}
								width={0}
								height={0}
								priority={true}
								src={usr.picture}
								alt={`${usr.username} picture`}
								placeholder="empty"
								className="rounded-full object-cover w-full h-full cursor-pointer shadow-strip"
							/>
						</div>
						<div
							className={
								isPicZoomed
									? "fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] flex"
									: "hidden"
							}
							onClick={() => hideUsrPicZoomOverlay()}>
							{isPicZoomed && (
								<Image
									width={0}
									height={0}
									priority={true}
									placeholder="empty"
									src={usr.picture}
									alt={`${usr.username} picture`}
									className="block m-auto w-[96%] aspect-square object-cover rounded-full animate-resizeZoom"
								/>
							)}
						</div>

						{followed ? (
							<div>
								<p className="text-clamp8 pt-[0.4rem] text-appmauvedark">
									{" "}
									You follow {usr.username}.
								</p>
							</div>
						) : (
							<div className="text-clamp8 pt-[0.4rem] text-gray-400">
								{" "}
								You don&apos;t follow {usr.username}.
							</div>
						)}
						{followingUsr ? (
							<div>
								<p className="text-clamp8 pb-[1.2rem] text-appmagenta">
									{" "}
									{usr.username} follows you.
								</p>
							</div>
						) : (
							<div className="text-clamp8 pb-[1.2rem] text-gray-400">
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
								className={`flex cursor-pointer items-center justify-center bg-[#FF7900] text-appblck rounded-xl w-[3.6rem] h-[3.6rem] my-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
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
									className="">
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
										className={`bg-appstone text-clamp6 text-white w-[3.6rem] h-[3.6rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue shadow-neatcard ${
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
										className={`bg-appstone text-clamp6 text-white w-[3.6rem] h-[3.6rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue shadow-neatcard ${
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

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostLiking from "./postLiking";
import LinkVideo from "./linkVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap } from "../motions/pageWrap";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import moment from "moment/moment";
import PostAdd from "./postAdd";
import Loading from "../loading";
import PostCardsAside from "../tools/postCardsAside";
import HomeFollows from "../users/homeFollows";
import { useSearchParams } from "next/navigation";
import ShareLink from "../tools/shareLink";
import { create } from "@/app/actions";
import PaginationController from "../global/paginationController";
import { FocusOn } from "react-focus-on";
import { useMediaQuery } from "react-responsive";

export default function Cards({
	posts,
	allPosts,
	users,
	session,
	totalPages,
	page,
}) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pg = searchParams.get("page") ?? "1";
	const [isLoading, setIsLoading] = useState(true);
	const [display, setDisplay] = useState(posts);
	const [postImgZoom, setPostImgZoom] = useState(false);
	const [userPicZoom, setUserPicZoom] = useState(false);
	const [usrLinkEffect, setUsrLinkEffect] = useState(false);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [modifyBtnEffect, setModifyBtnEffect] = useState(false);
	const [deleteBtnEffect, setDeleteBtnEffect] = useState(false);
	const [goToPostEffect, setGoToPostEffect] = useState(false);
	const [commentEffect, setCommentEffect] = useState(false);
	const [allFollowers, setAllFollowers] = useState();
	const [allFollowings, setAllFollowings] = useState();
	const [errMsg, setErrMsg] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);
	const isSmallDevice = useMediaQuery({
		query: "(max-width: 1023px)",
	});
	const isBiggerDevice = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	const isBrowser = () => typeof window !== "undefined";

	useEffect(() => {
		setHasMounted(true);
	}, []);

	useEffect(() => {
		if (session.user.token) {
			create(session.user.token);
		}
	}, [session.user.token]);

	useEffect(() => {
		if (session && posts) {
			setIsLoading(false);
		}
	}, [session, posts, display]);

	const dateParser = (num) => {
		let options = {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			weekday: "long",
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		let timestamp = Date.parse(num);
		let date = new Date(timestamp).toLocaleDateString("en-US", options);
		return date.toString();
	};

	const dateParser2 = (num) => {
		const timeAgo = moment(num).fromNow();
		return timeAgo;
	};

	const modifBtn = () => {
		setModifyBtnEffect(true);
		router.refresh();
	};

	const handleDelete = async (postid) => {
		setDeleteBtnEffect(true);
		setErrMsg("");
		setTimeout(async () => {
			try {
				let answer = window.confirm(
					"Are you sure you want to delete this post?"
				);
				if (answer) {
					const res = await axiosAuth.delete(`/posts/${postid}`);
					console.log("deleted ? : ", res);
					if (!res) {
						setErrMsg("Something went wrong, post was not removed");
						if (!isBrowser()) return;
						window.scrollTo({ top: 0, behavior: "smooth" });
					} else {
						const resp = await axiosAuth.get(
							`/posts?page=${pg}&per_page=6`
						);
						setDisplay(resp.data.content);
					}
				}
			} catch (err) {
				console.log("delete post err : ", err);
				setErrMsg("Something went wrong, post was not removed");
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}, 601);
	};

	useEffect(() => {
		if (!isBrowser()) return;
		const foundHash = window.location.hash;
		setTimeout(() => {
			if (foundHash) {
				let targetid = foundHash.replace(/.*\#/, "");
				const target = document.getElementById(targetid);
				if (target) {
					target.scrollIntoView({
						behavior: "smooth",
						block: "start",
						inline: "nearest",
					});
					target.focus();
				}
			}
		}, 500);
	}, []);

	const goToPost = () => {
		setGoToPostEffect(true);
	};

	const handleComment = () => {
		setCommentEffect(true);
	};

	// handle overlays function
	function showOverlay() {
		const scrollY =
			document.documentElement.style.getPropertyValue("--scroll-y");
		const body = document.body;
		body.style.position = "fixed";
		body.style.top = `-${scrollY}`;
	}
	function hideOverlay() {
		const body = document.body;
		const scrollY = body.style.top;
		body.style.position = "";
		body.style.top = "";
		if (!isBrowser()) return;
		window.scrollTo(0, parseInt(scrollY || "0") * -1);
	}
	// user picture zoom
	function showUsrPicZoomOverlay() {
		setUserPicZoom(true);
		showOverlay();
	}
	function hideUsrPicZoomOverlay() {
		hideOverlay();
		setUserPicZoom(false);
	}
	// post image zoom
	function showPostImgZoomOverlay() {
		setPostImgZoom(true);
		showOverlay();
	}
	function hidePostImgZoomOverlay() {
		hideOverlay();
		setPostImgZoom(false);
	}

	if (!hasMounted) {
		return null;
	}

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
				<PageWrap>
					{isSmallDevice ? (
						<>
							<PostCardsAside
								posts={allPosts}
								session={session}
								users={users}
								allFollowers={allFollowers}
								setAllFollowers={setAllFollowers}
								allFollowings={allFollowings}
								setAllFollowings={setAllFollowings}
							/>
							<main className="flex flex-col items-center mb-[1.2rem]">
								<div className="mt-[1.6rem] mb-[1.6rem] flex flex-col items-center w-[33.12rem]">
									{/* follows */}
									<HomeFollows
										session={session}
										allFollowers={allFollowers}
										setAllFollowers={setAllFollowers}
										allFollowings={allFollowings}
										setAllFollowings={setAllFollowings}
									/>
									{/* post form */}
									<div className="flex items-center flex-col">
										<hr className="w-[80vw] text-center my-[2rem] border-t-solid border-t-[0.22rem] rounded-md border-t-gray-300 dark:border-t-gray-600"></hr>
										<div className="flex items-center gap-[2rem]">
											<h3 className="text-clamp7 mob88:text-clamp1 font-medium underline underline-offset-2">
												What&apos;s on your mind?
											</h3>
											<PostAdd
												display={display}
												setPosts={setDisplay}
											/>
										</div>
										<hr className="w-[80vw] text-center my-[2rem] border-t-solid border-t-[0.22rem] rounded-md border-t-gray-300 dark:border-t-gray-600"></hr>
									</div>
								</div>

								{/* All Posts */}
								{display?.length > 0 ? (
									display?.map((post, index, params) => (
										<article
											key={post.id}
											id={post.id}
											className="w-full h-full">
											<div
												className="sr-only"
												aria-label={`post ${
													post.id
												} card article written by ${
													session?.user?.user_id ===
													post.user_id
														? "You"
														: `${post.user.username}`
												}`}></div>
											<AnimatePresence mode="popLayout">
												<motion.div
													layout={
														userPicZoom
															? false
															: true
													}
													key={post.id}
													initial={{
														opacity: 0,
														y: 40,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													exit={{ opacity: 0, y: 40 }}
													transition={{
														type: "spring",
														delay: 0.2,
													}}
													className={`m-auto border-[0.3rem] rounded-lg shadow-md my-[0.8rem] relative w-[90%] bg-appmauvelighter dark:bg-appmauvedarker border-appmauvelight dark:border-[#603f9f] ${
														userPicZoom && "w-full"
													}  `}>
													{/* zoom overlays */}
													{clickedBtn === index &&
														userPicZoom && (
															<FocusOn
																onEscapeKey={() =>
																	hideUsrPicZoomOverlay()
																}>
																<div
																	className="fixed overflow-y-auto left-0 right-0 top-0 bottom-0 w-screen h-full bg-white dark:bg-appblck z-[998] block"
																	onClick={() =>
																		hideUsrPicZoomOverlay()
																	}>
																	<div className="flex w-full h-full justify-center items-center">
																		<Image
																			tabIndex={
																				0
																			}
																			title="click or press escape to zoom out"
																			width={
																				0
																			}
																			height={
																				0
																			}
																			priority={
																				true
																			}
																			placeholder="empty"
																			src={`${process.env.NEXT_PUBLIC_API}${post.user.picture}`}
																			alt={
																				session
																					?.user
																					?.user_id ===
																				post.user_id
																					? "Your picture zoomed in"
																					: `zoomed in ${post.user.username} picture`
																			}
																			className="block m-auto w-[96%] h-auto object-cover rounded-lg animate-rotateZoom"
																		/>
																	</div>
																</div>
															</FocusOn>
														)}
													{clickedBtn === index &&
														postImgZoom && (
															<FocusOn
																onEscapeKey={() =>
																	hidePostImgZoomOverlay()
																}>
																<div
																	className="fixed overflow-y-auto left-0 right-0 top-0 bottom-0 w-screen h-full bg-white dark:bg-appblck z-[998] block"
																	onClick={() =>
																		hidePostImgZoomOverlay()
																	}>
																	<div className="flex w-full h-full justify-center items-center">
																		<Image
																			tabIndex={
																				0
																			}
																			title="click or press escape to zoom out"
																			width={
																				0
																			}
																			height={
																				0
																			}
																			priority={
																				true
																			}
																			placeholder="empty"
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			alt="zoomed post image"
																			className="block m-auto w-[96%] h-auto object-cover rounded-lg animate-rotateZoom"
																		/>
																	</div>
																</div>
															</FocusOn>
														)}

													{/* post cards */}
													<div className="flex text-clamp6 mx-[1.2rem] mt-[0.8rem] mb-[0.3rem] touch-auto">
														<button
															title="click or press enter to zoom in"
															className={`w-[4rem] h-[4rem] mob88:w-[2.2rem] mob88:h-[2.2rem] rounded-full mr-[0.8rem] border-[1px] focus-visible:outline-offset-[0.4rem] border-gray-300 transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light shadow-strip ${
																userPicZoom &&
																"hidden"
															}`}
															onClick={() => {
																setClickedBtn(
																	index
																);
																showUsrPicZoomOverlay();
															}}
															onKeyUp={(e) => {
																if (
																	e.key ===
																	"Enter"
																) {
																	setClickedBtn(
																		index
																	);
																	showUsrPicZoomOverlay();
																}
															}}>
															<Image
																aria-description="click or press enter to zoom in"
																width={0}
																height={0}
																placeholder="empty"
																className="rounded-full object-cover w-full h-full cursor-pointer"
																src={`${process.env.NEXT_PUBLIC_API}${post.user.picture}`}
																alt={
																	session
																		?.user
																		?.user_id ===
																	post.user_id
																		? "your picture"
																		: `${post.user.username} picture`
																}
															/>
														</button>
														<div className="flex items-end">
															{/* onclick link to user[user_id] params */}
															{session?.user
																.user_id ===
															post.user_id ? (
																<div>
																	<p
																		aria-hidden
																		className="mb-[0.5rem] font-medium">
																		You
																	</p>
																</div>
															) : (
																<nav
																	aria-label="go to user profile"
																	className={`mb-[0.5rem] font-medium hover:text-appturq active:text-appturq ${
																		clickedBtn ===
																			index &&
																		usrLinkEffect &&
																		"animate-resizeBtn"
																	}`}
																	onClick={() => {
																		setClickedBtn(
																			index
																		);
																		setUsrLinkEffect(
																			true
																		);
																	}}
																	onAnimationEnd={() =>
																		setUsrLinkEffect(
																			false
																		)
																	}>
																	<a
																		className=""
																		href={`/csian/${[
																			post.user_id,
																		]}?pi=${
																			post.id
																		}&pg=${pg}`}>
																		{
																			post
																				.user
																				.username
																		}
																	</a>
																</nav>
															)}
														</div>
													</div>
													<div className="flex justify-end text-clamp2 mx-[0.8rem] mt-[-1rem] mb-[0.1rem] font-extralight">
														<p>
															{dateParser(
																post.createdAt
															)}
														</p>
													</div>
													{post.title ? (
														<div className="">
															<h2 className="text-clamp7 mob88:text-clamp1 text-center font-medium pt-[0.5rem] border-t-2 border-t-appmauvelight dark:border-t-[#603f9f]">
																{post.title}
															</h2>
														</div>
													) : (
														<hr className="border-t-2 border-t-appmauvelight dark:border-t-[#603f9f]"></hr>
													)}
													<nav
														aria-label="go to post"
														onClick={() => {
															setClickedBtn(
																index
															);
															goToPost();
														}}
														className={`cursor-pointer line-clamp-3
													 text-clamp1 mx-[0.8rem] mt-[0.4rem] mb-[0.8rem] p-[0.4rem] hover:drop-shadow-linkTxt ${
															clickedBtn ===
																index &&
															goToPostEffect &&
															"opacity-50"
														}`}>
														<a
															className="p-[0.3rem] line-clamp-3"
															href={`/coms/${[
																post.id,
															]}?pg=${pg}`}>
															{post.content}
														</a>
													</nav>
													{post.fileUrl &&
														post.fileUrl?.includes(
															"image"
														) && (
															<div
																tabIndex={0}
																title="click or press enter to zoom in"
																className="flex w-[26rem] h-[15rem] max-w-[28rem] mob00:max-w-[90%] mx-auto mt-[2.2rem] mb-[2.4rem] focus-visible:outline-offset-[0.4rem] touch-auto rounded-2xl shadow-card"
																onClick={() => {
																	setClickedBtn(
																		index
																	);
																	showPostImgZoomOverlay();
																}}
																onKeyUp={(
																	e
																) => {
																	if (
																		e.key ===
																		"Enter"
																	) {
																		setClickedBtn(
																			index
																		);
																		showPostImgZoomOverlay();
																	}
																}}>
																<Image
																	aria-description="click or press enter to zoom in"
																	width={0}
																	height={0}
																	placeholder="empty"
																	className="rounded-2xl object-cover object-center-up hover:object-center-down hover:shadow-neatcard w-full h-auto max-w-[28rem] max-h-[15rem] cursor-pointer"
																	src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																	alt="post image"
																	priority={
																		true
																	}
																/>
															</div>
														)}
													{post.fileUrl &&
														post.fileUrl?.includes(
															"audio"
														) && (
															<div className="flex justify-center mx-auto mt-[2.2rem] mb-[2.4rem]">
																<audio
																	controls
																	className="rounded-lg">
																	<source
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		type="audio/mpeg"
																	/>
																	<source
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		type="audio/ogg"
																	/>
																	<source
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		type="audio/wav"
																	/>
																	Your browser
																	does not
																	support the
																	audio tag.
																</audio>
															</div>
														)}
													{post.fileUrl &&
														post.fileUrl?.includes(
															"video"
														) && (
															<div className="flex w-[98%] justify-center mx-auto mt-[2.2rem] mb-[2.4rem] rounded-2xl shadow-card">
																<video
																	id={post.id}
																	width="100%"
																	height="200"
																	controls
																	className="rounded-2xl">
																	<source
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		type={
																			"video/mp4"
																		}
																	/>
																	<source
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		type="video/ogg"
																	/>
																	<source
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		type="video/webM"
																	/>
																	Your browser
																	does not
																	support
																	HTML5 video.{" "}
																</video>
															</div>
														)}
													{post.link && (
														<LinkVideo
															postLink={post.link}
														/>
													)}
													{session?.user.user_id ===
														post.user_id ||
													session?.user.role ===
														"admin" ? (
														<>
															<div className="flex justify-end mb-[0.4rem] mx-[2.4rem]">
																{/* onclick link to post[id] params */}
																<nav
																	onClick={() => {
																		setClickedBtn(
																			index
																		);
																		modifBtn();
																	}}
																	onAnimationEnd={() =>
																		setModifyBtnEffect(
																			false
																		)
																	}
																	className={`flex relative items-center justify-center text-[1.4rem] mx-[0.8rem] bg-appstone text-white w-[3.2rem] h-[2.8rem] max-[293px]:w-[2.8rem] max-[293px]:h-[2.4rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
																		clickedBtn ===
																			index &&
																		modifyBtnEffect &&
																		"animate-bgSize"
																	}`}>
																	<a
																		title="go to edit page"
																		href={`/upd/${[
																			post.id,
																		]}?pg=${pg}`}
																		className="flex items-center justify-center w-[3.2rem] h-[2.8rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem]">
																		<FontAwesomeIcon
																			icon={
																				faPenToSquare
																			}
																		/>
																	</a>
																</nav>
																<div className="flex items-center mb-[0.8rem]">
																	<button
																		title="delete post"
																		onClick={() => {
																			setClickedBtn(
																				index
																			);
																			handleDelete(
																				post.id
																			);
																		}}
																		onAnimationEnd={() =>
																			setDeleteBtnEffect(
																				false
																			)
																		}
																		className={`bg-appred text-white text-[1.4rem] w-[3.2rem] h-[2.8rem] max-[293px]:w-[2.8rem] max-[293px]:h-[2.4rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-opacity-60 hover:text-appblck dark:hover:text-white hover:translate-y-[7px] hover:shadow-btnlred bg-[linear-gradient(#ca2401,#ca2401)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
																			clickedBtn ===
																				index &&
																			deleteBtnEffect &&
																			"animate-bgSize"
																		}`}>
																		<FontAwesomeIcon
																			icon={
																				faTrashCan
																			}
																		/>
																	</button>
																</div>
															</div>
															<AnimatePresence>
																{clickedBtn ===
																	index &&
																	errMsg && (
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
																			className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 mb-[1.2rem]"
																			role="alert"
																			aria-live="assertive">
																			{
																				errMsg
																			}
																		</motion.p>
																	)}
															</AnimatePresence>
														</>
													) : (
														<div></div>
													)}
													<div className="flex justify-between text-clamp2">
														<PostLiking
															post={post}
															session={session}
														/>
														{/* comment post */}
														<div className="flex mr-[4.8rem]">
															<span
																aria-label={`${post.discussions} comments`}
																className="sr-only"></span>
															<span
																aria-hidden
																className="mr-[0.4rem]">
																{
																	post.discussions
																}
															</span>
															<nav
																onClick={() => {
																	setClickedBtn(
																		index
																	);
																	handleComment();
																}}
																onAnimationEnd={() =>
																	setCommentEffect(
																		false
																	)
																}
																className={`cursor-pointer hover:opacity-50 ${
																	clickedBtn ===
																		index &&
																	commentEffect &&
																	"animate-resizeBtn"
																}`}>
																<a
																	title="Go to post detail"
																	href={`/coms/${[
																		post.id,
																	]}?pg=${pg}`}>
																	<FontAwesomeIcon
																		icon={
																			faComments
																		}
																		style={{
																			color: "#2ECEC2",
																		}}
																	/>
																</a>
															</nav>
														</div>
														{/* share post */}
														<ShareLink
															post={post}
														/>
													</div>
													<div className="flex flex-col items-center justify-center my-[0.4rem] text-clamp2 font-extralight">
														{post.editedAt ? (
															post.editedByAdmin ? (
																<p className="">
																	Edited{" "}
																	<span className="font-medium text-indigo-500 dark:text-indigo-300">
																		{" "}
																		BY ADMIN
																	</span>{" "}
																	{dateParser2(
																		post.editedAt
																	)}
																</p>
															) : (
																<p className="">
																	Edited{" "}
																	{dateParser2(
																		post.editedAt
																	)}
																</p>
															)
														) : (
															<p></p>
														)}
													</div>
												</motion.div>
											</AnimatePresence>
										</article>
									))
								) : (
									<div className="flex flex-col justify-center items-center text-clamp7 w-screen h-[50vh] font-bold">
										<p>
											Aww, there&apos;s no posts to
											display... 😔
										</p>
										<p>Let&apos;s share something new 🥺</p>
									</div>
								)}
								<div
									className="sr-only"
									aria-label="no more posts for this page"></div>
							</main>
							{display?.length > 0 ? (
								<PaginationController
									totalPages={totalPages}
									hasPrevPage={Number(page) > 1}
									hasNextPage={
										Number(page) < Number(totalPages)
									}
								/>
							) : null}
						</>
					) : (
						<>
							<div className="grid grid-cols-[60%_40%]">
								<main className="flex flex-col items-center mb-[1.2rem]">
									<div className="mt-[1.6rem] mb-[1.6rem] flex flex-col items-center w-[33.12rem]">
										{/* follows */}
										<HomeFollows
											session={session}
											allFollowers={allFollowers}
											setAllFollowers={setAllFollowers}
											allFollowings={allFollowings}
											setAllFollowings={setAllFollowings}
										/>
										{/* post form */}
										<div className="flex items-center flex-col">
											<hr className="w-[30vw] text-center my-[2rem] border-t-solid border-t-[0.22rem] rounded-md border-t-gray-300 dark:border-t-gray-600"></hr>
											<div className="flex items-center gap-[2rem]">
												<h3 className="text-clamp7 mob88:text-clamp1 font-medium underline underline-offset-2">
													What&apos;s on your mind?
												</h3>
												<PostAdd
													display={display}
													setPosts={setDisplay}
												/>
											</div>
											<hr className="w-[30vw] text-center my-[2rem] border-t-solid border-t-[0.22rem] rounded-md border-t-gray-300 dark:border-t-gray-600"></hr>
										</div>
									</div>

									{/* All Posts */}
									{display?.length > 0 ? (
										display?.map((post, index, params) => (
											<article
												key={post.id}
												id={post.id}
												className="w-full h-full">
												<div
													className="sr-only"
													aria-label={`post ${
														post.id
													} card article written by ${
														session?.user
															?.user_id ===
														post.user_id
															? "You"
															: `${post.user.username}`
													}`}></div>
												<AnimatePresence mode="popLayout">
													<motion.div
														layout={
															userPicZoom
																? false
																: true
														}
														key={post.id}
														initial={{
															opacity: 0,
															y: 40,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														exit={{
															opacity: 0,
															y: 40,
														}}
														transition={{
															type: "spring",
															delay: 0.2,
														}}
														className={`m-auto border-[0.3rem] rounded-lg shadow-md my-[0.8rem] relative w-[90%] bg-appmauvelighter dark:bg-appmauvedarker border-appmauvelight dark:border-[#603f9f] ${
															userPicZoom &&
															"w-full"
														}  `}>
														{/* zoom overlays */}
														{clickedBtn === index &&
															userPicZoom && (
																<FocusOn
																	onEscapeKey={() =>
																		hideUsrPicZoomOverlay()
																	}>
																	<div
																		className="fixed overflow-y-auto left-0 right-0 top-0 bottom-0 w-screen h-full bg-white dark:bg-appblck z-[998] block"
																		onClick={() =>
																			hideUsrPicZoomOverlay()
																		}>
																		<div className="flex w-full h-full justify-center items-center">
																			<Image
																				tabIndex={
																					0
																				}
																				title="click or press escape to zoom out"
																				width={
																					0
																				}
																				height={
																					0
																				}
																				priority={
																					true
																				}
																				placeholder="empty"
																				src={`${process.env.NEXT_PUBLIC_API}${post.user.picture}`}
																				alt={
																					session
																						?.user
																						?.user_id ===
																					post.user_id
																						? "Your picture zoomed in"
																						: `zoomed in ${post.user.username} picture`
																				}
																				className="block m-auto w-[96%] h-auto object-cover rounded-lg animate-rotateZoom"
																			/>
																		</div>
																	</div>
																</FocusOn>
															)}
														{clickedBtn === index &&
															postImgZoom && (
																<FocusOn
																	onEscapeKey={() =>
																		hidePostImgZoomOverlay()
																	}>
																	<div
																		className="fixed overflow-y-auto left-0 right-0 top-0 bottom-0 w-screen h-full bg-white dark:bg-appblck z-[998] block"
																		onClick={() =>
																			hidePostImgZoomOverlay()
																		}>
																		<div className="flex w-full h-full justify-center items-center">
																			<Image
																				tabIndex={
																					0
																				}
																				title="click or press escape to zoom out"
																				width={
																					0
																				}
																				height={
																					0
																				}
																				priority={
																					true
																				}
																				placeholder="empty"
																				src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																				alt="zoomed post image"
																				className="block m-auto w-[96%] h-auto object-cover rounded-lg animate-rotateZoom"
																			/>
																		</div>
																	</div>
																</FocusOn>
															)}

														{/* post cards */}
														<div className="flex text-clamp6 mx-[1.2rem] mt-[0.8rem] mb-[0.3rem] touch-auto">
															<button
																title="click or press enter to zoom in"
																className={`w-[4rem] h-[4rem] mob88:w-[2.2rem] mob88:h-[2.2rem] rounded-full mr-[0.8rem] border-[1px] focus-visible:outline-offset-[0.4rem] border-gray-300 transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light shadow-strip ${
																	userPicZoom &&
																	"hidden"
																}`}
																onClick={() => {
																	setClickedBtn(
																		index
																	);
																	showUsrPicZoomOverlay();
																}}
																onKeyUp={(
																	e
																) => {
																	if (
																		e.key ===
																		"Enter"
																	) {
																		setClickedBtn(
																			index
																		);
																		showUsrPicZoomOverlay();
																	}
																}}>
																<Image
																	aria-description="click or press enter to zoom in"
																	width={0}
																	height={0}
																	placeholder="empty"
																	className="rounded-full object-cover w-full h-full cursor-pointer"
																	src={`${process.env.NEXT_PUBLIC_API}${post.user.picture}`}
																	alt={
																		session
																			?.user
																			?.user_id ===
																		post.user_id
																			? "your picture"
																			: `${post.user.username} picture`
																	}
																/>
															</button>
															<div className="flex items-end">
																{/* onclick link to user[user_id] params */}
																{session?.user
																	.user_id ===
																post.user_id ? (
																	<div>
																		<p
																			aria-hidden
																			className="mb-[0.5rem] font-medium">
																			You
																		</p>
																	</div>
																) : (
																	<nav
																		aria-label="go to user profile"
																		className={`mb-[0.5rem] font-medium hover:text-appturq active:text-appturq ${
																			clickedBtn ===
																				index &&
																			usrLinkEffect &&
																			"animate-resizeBtn"
																		}`}
																		onClick={() => {
																			setClickedBtn(
																				index
																			);
																			setUsrLinkEffect(
																				true
																			);
																		}}
																		onAnimationEnd={() =>
																			setUsrLinkEffect(
																				false
																			)
																		}>
																		<a
																			className=""
																			href={`/csian/${[
																				post.user_id,
																			]}?pi=${
																				post.id
																			}&pg=${pg}`}>
																			{
																				post
																					.user
																					.username
																			}
																		</a>
																	</nav>
																)}
															</div>
														</div>
														<div className="flex justify-end text-clamp2 mx-[0.8rem] mt-[-1rem] mb-[0.1rem] font-extralight">
															<p>
																{dateParser(
																	post.createdAt
																)}
															</p>
														</div>
														{post.title ? (
															<div className="">
																<h2 className="text-clamp7 mob88:text-clamp1 text-center font-medium pt-[0.5rem] border-t-2 border-t-appmauvelight dark:border-t-[#603f9f]">
																	{post.title}
																</h2>
															</div>
														) : (
															<hr className="border-t-2 border-t-appmauvelight dark:border-t-[#603f9f]"></hr>
														)}
														<nav
															aria-label="go to post"
															onClick={() => {
																setClickedBtn(
																	index
																);
																goToPost();
															}}
															className={`cursor-pointer line-clamp-3
													 text-clamp1 mx-[0.8rem] mt-[0.4rem] mb-[0.8rem] p-[0.4rem] hover:drop-shadow-linkTxt ${
															clickedBtn ===
																index &&
															goToPostEffect &&
															"opacity-50"
														}`}>
															<a
																className="p-[0.3rem] line-clamp-3"
																href={`/coms/${[
																	post.id,
																]}?pg=${pg}`}>
																{post.content}
															</a>
														</nav>
														{post.fileUrl &&
															post.fileUrl?.includes(
																"image"
															) && (
																<div
																	tabIndex={0}
																	title="click or press enter to zoom in"
																	className="flex w-[70%] h-[20rem] mx-auto mt-[2.2rem] mb-[2.4rem] focus-visible:outline-offset-[0.4rem] touch-auto rounded-2xl shadow-card"
																	onClick={() => {
																		setClickedBtn(
																			index
																		);
																		showPostImgZoomOverlay();
																	}}
																	onKeyUp={(
																		e
																	) => {
																		if (
																			e.key ===
																			"Enter"
																		) {
																			setClickedBtn(
																				index
																			);
																			showPostImgZoomOverlay();
																		}
																	}}>
																	<Image
																		aria-description="click or press enter to zoom in"
																		width={
																			0
																		}
																		height={
																			0
																		}
																		placeholder="empty"
																		className="rounded-2xl object-cover object-center-up hover:object-center-down hover:shadow-neatcard w-full h-auto cursor-pointer"
																		src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																		alt="post image"
																		priority={
																			true
																		}
																	/>
																</div>
															)}
														{post.fileUrl &&
															post.fileUrl?.includes(
																"audio"
															) && (
																<div className="flex justify-center mx-auto mt-[2.2rem] mb-[2.4rem]">
																	<audio
																		controls
																		className="rounded-lg">
																		<source
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			type="audio/mpeg"
																		/>
																		<source
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			type="audio/ogg"
																		/>
																		<source
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			type="audio/wav"
																		/>
																		Your
																		browser
																		does not
																		support
																		the
																		audio
																		tag.
																	</audio>
																</div>
															)}
														{post.fileUrl &&
															post.fileUrl?.includes(
																"video"
															) && (
																<div className="flex w-[98%] justify-center mx-auto mt-[2.2rem] mb-[2.4rem] rounded-2xl shadow-card">
																	<video
																		id={
																			post.id
																		}
																		width="100%"
																		height="200"
																		controls
																		className="rounded-2xl">
																		<source
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			type={
																				"video/mp4"
																			}
																		/>
																		<source
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			type="video/ogg"
																		/>
																		<source
																			src={`${process.env.NEXT_PUBLIC_API}${post.fileUrl}`}
																			type="video/webM"
																		/>
																		Your
																		browser
																		does not
																		support
																		HTML5
																		video.{" "}
																	</video>
																</div>
															)}
														{post.link && (
															<LinkVideo
																postLink={
																	post.link
																}
															/>
														)}
														{session?.user
															.user_id ===
															post.user_id ||
														session?.user.role ===
															"admin" ? (
															<>
																<div className="flex justify-end mb-[0.4rem] mx-[2.4rem]">
																	{/* onclick link to post[id] params */}
																	<nav
																		onClick={() => {
																			setClickedBtn(
																				index
																			);
																			modifBtn();
																		}}
																		onAnimationEnd={() =>
																			setModifyBtnEffect(
																				false
																			)
																		}
																		className={`flex relative items-center justify-center text-[1.4rem] mx-[0.8rem] bg-appstone text-white w-[3.2rem] h-[2.8rem] max-[293px]:w-[2.8rem] max-[293px]:h-[2.4rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
																			clickedBtn ===
																				index &&
																			modifyBtnEffect &&
																			"animate-bgSize"
																		}`}>
																		<a
																			title="go to edit page"
																			href={`/upd/${[
																				post.id,
																			]}?pg=${pg}`}
																			className="flex items-center justify-center w-[3.2rem] h-[2.8rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem]">
																			<FontAwesomeIcon
																				icon={
																					faPenToSquare
																				}
																			/>
																		</a>
																	</nav>
																	<div className="flex items-center mb-[0.8rem]">
																		<button
																			title="delete post"
																			onClick={() => {
																				setClickedBtn(
																					index
																				);
																				handleDelete(
																					post.id
																				);
																			}}
																			onAnimationEnd={() =>
																				setDeleteBtnEffect(
																					false
																				)
																			}
																			className={`bg-appred text-white text-[1.4rem] w-[3.2rem] h-[2.8rem] max-[293px]:w-[2.8rem] max-[293px]:h-[2.4rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-opacity-60 hover:text-appblck dark:hover:text-white hover:translate-y-[7px] hover:shadow-btnlred bg-[linear-gradient(#ca2401,#ca2401)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
																				clickedBtn ===
																					index &&
																				deleteBtnEffect &&
																				"animate-bgSize"
																			}`}>
																			<FontAwesomeIcon
																				icon={
																					faTrashCan
																				}
																			/>
																		</button>
																	</div>
																</div>
																<AnimatePresence>
																	{clickedBtn ===
																		index &&
																		errMsg && (
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
																				className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 mb-[1.2rem]"
																				role="alert"
																				aria-live="assertive">
																				{
																					errMsg
																				}
																			</motion.p>
																		)}
																</AnimatePresence>
															</>
														) : (
															<div></div>
														)}
														<div className="flex justify-between text-clamp2">
															<PostLiking
																post={post}
																session={
																	session
																}
															/>
															{/* comment post */}
															<div className="flex mr-[4.8rem]">
																<span
																	aria-label={`${post.discussions} comments`}
																	className="sr-only"></span>
																<span
																	aria-hidden
																	className="mr-[0.4rem]">
																	{
																		post.discussions
																	}
																</span>
																<nav
																	onClick={() => {
																		setClickedBtn(
																			index
																		);
																		handleComment();
																	}}
																	onAnimationEnd={() =>
																		setCommentEffect(
																			false
																		)
																	}
																	className={`cursor-pointer hover:opacity-50 ${
																		clickedBtn ===
																			index &&
																		commentEffect &&
																		"animate-resizeBtn"
																	}`}>
																	<a
																		title="Go to post detail"
																		href={`/coms/${[
																			post.id,
																		]}?pg=${pg}`}>
																		<FontAwesomeIcon
																			icon={
																				faComments
																			}
																			style={{
																				color: "#2ECEC2",
																			}}
																		/>
																	</a>
																</nav>
															</div>
															{/* share post */}
															<ShareLink
																post={post}
															/>
														</div>
														<div className="flex flex-col items-center justify-center my-[0.4rem] text-clamp2 font-extralight">
															{post.editedAt ? (
																post.editedByAdmin ? (
																	<p className="">
																		Edited{" "}
																		<span className="font-medium text-indigo-500 dark:text-indigo-300">
																			{" "}
																			BY
																			ADMIN
																		</span>{" "}
																		{dateParser2(
																			post.editedAt
																		)}
																	</p>
																) : (
																	<p className="">
																		Edited{" "}
																		{dateParser2(
																			post.editedAt
																		)}
																	</p>
																)
															) : (
																<p></p>
															)}
														</div>
													</motion.div>
												</AnimatePresence>
											</article>
										))
									) : (
										<div className="flex flex-col justify-center items-center text-clamp7 w-screen h-[50vh] font-bold">
											<p>
												Aww, there&apos;s no posts to
												display... 😔
											</p>
											<p>
												Let&apos;s share something new
												🥺
											</p>
										</div>
									)}
									<div
										className="sr-only"
										aria-label="no more posts for this page"></div>
								</main>
								<PostCardsAside
									posts={allPosts}
									session={session}
									users={users}
									allFollowers={allFollowers}
									setAllFollowers={setAllFollowers}
									allFollowings={allFollowings}
									setAllFollowings={setAllFollowings}
								/>
							</div>
							<div className="flex justify-center">
								{display?.length > 0 ? (
									<PaginationController
										totalPages={totalPages}
										hasPrevPage={Number(page) > 1}
										hasNextPage={
											Number(page) < Number(totalPages)
										}
									/>
								) : null}
							</div>
						</>
					)}
				</PageWrap>
			)}
		</>
	);
}

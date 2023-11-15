"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostLiking from "./postLiking";
import LinkVideo from "./linkVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShareFromSquare,
	faComments,
	faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrap } from "@/components/motions/pageWrap";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
import moment from "moment/moment";
import PostAdd from "./postAdd";
import ScrollTopButton from "../tools/scrollTopButton";
import ScrollBottomButton from "../tools/scrollBottomButton";
import Loading from "../loading";
import PostCardsAside from "../tools/postCardsAside";
import HomeFollows from "../users/homeFollows";
import { useSearchParams } from "next/navigation";

export default function Cards({ posts, allPosts, users, session }) {
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
	const [shareEffect, setShareEffect] = useState(false);
	const [allFollowers, setAllFollowers] = useState();
	const [allFollowings, setAllFollowings] = useState();
	const [errMsg, setErrMsg] = useState(false);
	const isBrowser = () => typeof window !== "undefined";

	useEffect(() => {
		if (session && posts) {
			setIsLoading(false);
			setDisplay(posts);
		}
	}, [session, posts, display]);

	useEffect(() => {
		const body = document.body;
		body.style.position = "";
		body.style.top = "";
	}, []);

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
						router.refresh();
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

	const handleShare = () => {
		setShareEffect(true);
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
							<h3 className="text-clamp7 font-medium underline underline-offset-2">
								What&apos;s on your mind?
							</h3>
							<PostAdd setPosts={setDisplay} />
						</div>
						{/* back to top button */}
						<ScrollTopButton />
						<ScrollBottomButton />
						{/* All Posts */}
						{display?.map((post, index, params) => (
							<article
								key={post.id}
								id={post.id}
								className="w-full h-full">
								<AnimatePresence mode="popLayout">
									<motion.div
										layout={userPicZoom ? false : true}
										key={post.id}
										initial={{ opacity: 0, y: 40 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 40 }}
										transition={{
											type: "spring",
											delay: 0.2,
										}}
										// transition={ { duration: 0.6, delay: 0.3 } }
										className={` m-auto border-2 rounded-lg shadow-md my-[0.8rem] relative w-[90%] ${
											userPicZoom && "w-full"
										}  `}>
										{/* zoom overlays */}
										{clickedBtn === index &&
											userPicZoom && (
												<div
													className="fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block"
													onClick={() =>
														hideUsrPicZoomOverlay()
													}>
													<Image
														width={0}
														height={0}
														priority={true}
														placeholder="empty"
														src={post.user.picture}
														alt={`${post.user.username} picture`}
														className="block m-auto w-[96%] h-auto object-cover my-[4.8rem] rounded-lg animate-rotateZoom"
													/>
												</div>
											)}
										{clickedBtn === index &&
											postImgZoom && (
												<div
													className="fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block"
													onClick={() =>
														hidePostImgZoomOverlay()
													}>
													<Image
														width={0}
														height={0}
														priority={true}
														placeholder="empty"
														src={post.fileUrl}
														alt="post image"
														className="block m-auto w-[96%] h-auto object-cover my-[4.8rem] rounded-lg animate-rotateZoom"
													/>
												</div>
											)}

										{/* post cards */}
										<div className="flex text-clamp6 mx-[1.2rem] mt-[0.8rem] mb-[0.3rem] touch-auto">
											<div
												className={`w-[4rem] h-[4rem] rounded-full mr-[0.8rem] border-[1px] border-gray-300 cursor-pointer transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light shadow-strip ${
													userPicZoom && "hidden"
												}`}
												onClick={() => {
													setClickedBtn(index);
													showUsrPicZoomOverlay();
												}}>
												<Image
													width={0}
													height={0}
													placeholder="empty"
													className="rounded-full object-cover w-full h-full cursor-pointer"
													src={post.user.picture}
													alt={`${post.user.username} picture`}
												/>
											</div>
											<div className="flex items-end">
												{/* onclick link to user[user_id] params */}
												{session?.user.user_id ===
												post.user_id ? (
													<div>
														<p className="mb-[0.5rem] font-medium">
															You
														</p>
													</div>
												) : (
													<nav
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
															href={`/csian/${[
																post.user_id,
															]}?pi=${
																post.id
															}&pg=${pg}`}>
															{post.user.username}
														</a>
													</nav>
												)}
											</div>
										</div>
										<div className="flex justify-end text-clamp2 mx-[0.8rem] mt-[-1rem] mb-[0.1rem] font-extralight">
											<p>{dateParser(post.createdAt)}</p>
										</div>
										{post.title ? (
											<div className="">
												<h2 className="text-clamp7 text-center font-medium border-t-2 border-b-2">
													{post.title}
												</h2>
											</div>
										) : (
											<hr className="border-b-[1.5px]"></hr>
										)}
										<nav
											onClick={() => {
												setClickedBtn(index);
												goToPost();
											}}
											className={`cursor-pointer line-clamp-3 text-clamp1 mx-[1.2rem] mt-[0.8rem] mb-[1.2rem] hover:drop-shadow-linkTxt ${
												clickedBtn === index &&
												goToPostEffect &&
												"opacity-50"
											}`}>
											<a
												href={`/coms/${[
													post.id,
												]}?pg=${pg}`}>
												{post.content}
											</a>
										</nav>
										{post.fileUrl &&
											post.fileUrl?.includes("image") && (
												<div
													className="flex w-[26rem] h-[15rem] max-w[28rem] mx-auto mt-[2.2rem] mb-[2.4rem] touch-auto rounded-2xl shadow-card"
													onClick={() => {
														setClickedBtn(index);
														showPostImgZoomOverlay();
													}}>
													<Image
														width={0}
														height={0}
														placeholder="empty"
														className="rounded-2xl object-cover object-center-up hover:object-center-down hover:shadow-neatcard w-full h-auto max-w-[28rem] max-h-[15rem] cursor-pointer"
														src={post.fileUrl}
														alt="post image"
														priority={true}
													/>
												</div>
											)}
										{post.fileUrl &&
											post.fileUrl?.includes("audio") && (
												<div className="flex justify-center mx-auto mt-[2.2rem] mb-[2.4rem]">
													<audio
														controls
														className="rounded-lg">
														<source
															src={post.fileUrl}
															type="audio/mpeg"
														/>
														<source
															src={post.fileUrl}
															type="audio/ogg"
														/>
														<source
															src={post.fileUrl}
															type="audio/wav"
														/>
														Your browser does not
														support the audio tag.
													</audio>
												</div>
											)}
										{post.fileUrl &&
											post.fileUrl?.includes("video") && (
												<div className="flex w-[98%] justify-center mx-auto mt-[2.2rem] mb-[2.4rem] rounded-2xl shadow-card">
													<video
														id={post.id}
														width="100%"
														height="200"
														controls
														className="rounded-2xl">
														<source
															src={post.fileUrl}
															type={"video/mp4"}
														/>
														<source
															src={post.fileUrl}
															type="video/ogg"
														/>
														<source
															src={post.fileUrl}
															type="video/webM"
														/>
														Your browser does not
														support HTML5 video.{" "}
													</video>
												</div>
											)}
										{post.link && (
											<LinkVideo postLink={post.link} />
										)}
										{session?.user.user_id ===
											post.user_id ||
										session?.user.role === "admin" ? (
											<>
												<div className="flex justify-end mb-[0.4rem] mx-[2.4rem]">
													{/* onclick link to post[id] params */}
													<nav
														title="edit post"
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
														className={`flex relative items-center justify-center text-[1.4rem] mx-[0.8rem] bg-appstone text-white w-[3.2rem] h-[2.8rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
															clickedBtn ===
																index &&
															modifyBtnEffect &&
															"animate-bgSize"
														}`}>
														<a
															href={`/upd/${[
																post.id,
															]}?pg=${pg}`}
															className="">
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
															className={`bg-appred text-white text-[1.4rem] w-[3.2rem] h-[2.8rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:text-appblck hover:translate-y-[7px] hover:shadow-btnlred bg-[linear-gradient(#ca2401,#ca2401)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
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
													{clickedBtn === index &&
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
																aria-live="assertive">
																{errMsg}
															</motion.p>
														)}
												</AnimatePresence>
											</>
										) : (
											<div></div>
										)}
										<div className="flex justify-between text-clamp2">
											<PostLiking post={post} />
											{/* comment post */}
											<div className="flex mr-[4.8rem]">
												<span className="mr-[0.4rem]">
													{post.discussions}
												</span>
												<nav
													title="enter post discussion"
													onClick={() => {
														setClickedBtn(index);
														handleComment();
													}}
													onAnimationEnd={() =>
														setCommentEffect(false)
													}
													className={`cursor-pointer hover:opacity-50 ${
														clickedBtn === index &&
														commentEffect &&
														"animate-resizeBtn"
													}`}>
													<a
														href={`/coms/${[
															post.id,
														]}?pg=${pg}`}>
														<FontAwesomeIcon
															icon={faComments}
															style={{
																color: "#2ECEC2",
															}}
														/>
													</a>
												</nav>
											</div>
											{/* share post */}
											<div
												className={`mr-[1.6rem] hover:opacity-50 ${
													clickedBtn === index &&
													shareEffect &&
													"animate-resizeBtn"
												}`}
												onAnimationEnd={() =>
													setShareEffect(false)
												}>
												<button
													title="share post"
													onClick={() => {
														setClickedBtn(index);
														handleShare();
													}}>
													<FontAwesomeIcon
														icon={faShareFromSquare}
														style={{
															color: "#7953be",
														}}
													/>
												</button>
											</div>
										</div>
										<div className="flex flex-col items-center justify-center my-[0.4rem] text-clamp2 font-extralight">
											{post.editedAt ? (
												post.editedByAdmin ? (
													<p className="">
														Edited{" "}
														<span className="font-medium text-indigo-500">
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
						))}
					</main>
				</PageWrap>
			)}
		</>
	);
}

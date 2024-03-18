"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import GoToPostSparkleBtn from "../motions/goToPostSparkleBtn";
import { FocusOn } from "react-focus-on";
import { useMediaQuery } from "react-responsive";

export default function TrendingCards(props) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const [trending, setTrending] = useState([]);
	const [trendShown, setTrendShown] = useState(false);
	const [blur, setBlur] = useState(false);
	const [usrLinkEffect, setUsrLinkEffect] = useState(false);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [showTrendingEffect, setShowTrendingEffect] = useState(false);
	const [hideTrendingEffect, setHideTrendingEffect] = useState(false);
	const [isTrend, setIsTrend] = useState(true);
	const isSmallDevice = useMediaQuery({
		query: "(max-width: 1023px)",
	});
	const isBiggerDevice = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	useEffect(() => {
		if (props.posts?.length > 0) {
			const postsArray = Object.keys(props.posts).map(
				(post) => props.posts[post]
			);
			let sortedPosts = postsArray.sort((a, b) => {
				return b.likes - a.likes;
			});
			sortedPosts.length = 3;
			setTrending(sortedPosts);
		}
	}, [props.posts, axiosAuth]);

	const showTrend = async () => {
		setShowTrendingEffect(true);
		setTimeout(() => {
			setTrendShown(true);
		}, 500);
		setTimeout(() => {
			setBlur(true);
		}, 1300);
	};

	const hideTrend = async () => {
		setHideTrendingEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			setTrendShown(false);
		}, 500);
	};

	const usrProfileLnk = (link) => {
		setUsrLinkEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			router.push(link);
			setTrendShown(false);
		}, 500);
	};

	return (
		<>
			{isSmallDevice && (
				<>
					{trendShown ? (
						<button
							title="hide trending"
							className="mob88:text-[1.2rem] bg-apppastgreen dark:bg-applightdark mb-[0.4rem] border-2 border-apppastgreen dark:border-applightdark rounded-tl-lg rounded-bl-lg pl-[0.8rem] pr-[0.4rem] hover:text-appmauvedark dark:hover:text-appopred shadow-strip"
							onClick={() => hideTrend()}>
							<FontAwesomeIcon
								icon={faChevronRight}
								className={`text-clamp1 mob88:text-[1.2rem] ${
									hideTrendingEffect && "animate-slideRight"
								}`}
								onAnimationEnd={() =>
									setHideTrendingEffect(false)
								}
							/>
						</button>
					) : (
						<button
							title="show trending"
							className="mob88:text-[1.2rem] bg-apppastgreen dark:bg-applightdark mb-[0.4rem] border-2 border-apppastgreen dark:border-applightdark rounded-tl-lg rounded-bl-lg pl-[0.6rem] pr-[0.8rem] hover:text-appmagenta dark:hover:text-appopred shadow-strip"
							onClick={() => showTrend()}>
							<FontAwesomeIcon
								icon={faChevronLeft}
								className={`text-clamp1 mob88:text-[1.2rem] ${
									showTrendingEffect && "animate-slideLeft"
								}`}
								onAnimationEnd={() =>
									setShowTrendingEffect(false)
								}
							/>
							<span className="text-clamp2 mob88:text-[1.2rem] ml-[0.4rem]">
								Trending
							</span>
						</button>
					)}
					<AnimatePresence>
						{trendShown && (
							<motion.section
								key="trend-cards"
								initial={{ opacity: 0, x: "100vw" }}
								animate={{ opacity: 1, x: 0 }}
								exit={{
									opacity: 0,
									y: 60,
									transition: {
										ease: "easeIn",
										duration: 0.6,
									},
								}}
								transition={{ duration: 0.5, origin: 1 }}
								className={`z-[690] w-screen top-0 left-0 h-full fixed ${
									blur && "animate-pop"
								}`}>
								<div
									className={`absolute w-full top-[13.5rem] mob88:top-[6.5rem] border-2 border-apppastgreen dark:border-applightdark bg-apppastgreen dark:bg-applightdark pt-[0.8rem] pb-[3.2rem] rounded-2xl shadow-neatcard ${
										trendShown && "flex flex-col"
									} ${!trendShown && "hidden"}`}>
									<FocusOn
										onClickOutside={() => {
											hideTrend();
										}}
										onEscapeKey={() => {
											hideTrend();
										}}>
										<div
											role="dialog"
											aria-labelledby="trend-ttl"></div>
										<div className="flex justify-end mr-[0.4rem]">
											<button
												aria-label="close trending"
												onClick={() => hideTrend()}>
												<FontAwesomeIcon
													icon={faXmark}
													size="2xl"
													onAnimationEnd={() =>
														setHideTrendingEffect(
															false
														)
													}
													className={`cursor-pointer hover:text-appred ${
														hideTrendingEffect &&
														"animate-pressed opacity-60"
													}`}
												/>
											</button>
										</div>
										<h2
											id="trend-ttl"
											className="text-center uppercase text-clamp5 mob88:text-clamp7 mb-[2.4rem] font-semibold">
											Trending
										</h2>
										{trending.map((post, index) => (
											<div
												key={post.id}
												id={post.id}
												className="w-full h-full">
												<div
													className={`bg-white dark:bg-appstone w-[96%] mx-auto border-2 border-white dark:border-appstone rounded-xl shadow-card my-[0.8rem] relative`}>
													<div className="flex text-clamp6 mob88:text-[1.4rem] mx-[1.2rem] mt-[0.4rem] mb-[0.3rem]">
														<div className="flex items-end">
															{props.session?.user
																.user_id ===
															post.user_id ? (
																<p className="mb-[0.5rem]">
																	You
																</p>
															) : (
																<a
																	href={`/csian/${[
																		post.user_id,
																	]}?pi=${
																		post.id
																	}`}
																	className={`px-[0.4rem] mb-[0.5rem] hover:text-appturq active:text-appturq ${
																		clickedBtn ===
																			index &&
																		usrLinkEffect &&
																		"animate-resizeBtn"
																	}`}
																	onClick={() => {
																		setClickedBtn(
																			index
																		);
																		usrProfileLnk(
																			`/csian/${[
																				post.user_id,
																			]}?pi=${
																				post.id
																			}`
																		);
																	}}
																	onAnimationEnd={() =>
																		setUsrLinkEffect(
																			false
																		)
																	}>
																	{
																		post
																			.user
																			.username
																	}
																</a>
															)}
														</div>
													</div>
													<div className="flex mx-[1.2rem] items-center">
														{post.fileUrl &&
															post.fileUrl?.includes(
																"image"
															) && (
																<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:h-[6rem] aspect-square touch-auto">
																	<Image
																		width={
																			0
																		}
																		height={
																			0
																		}
																		placeholder="empty"
																		className="rounded-xl object-cover object-top w-full h-full"
																		src={
																			post.fileUrl
																		}
																		alt="post image"
																	/>
																</div>
															)}
														{post.fileUrl &&
															post.fileUrl?.includes(
																"video"
															) && (
																<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:min-w-[6rem] aspect-square">
																	<video
																		id={
																			post.id
																		}
																		width="100%"
																		height="100%"
																		controls
																		style={{
																			borderRadius:
																				"12px",
																		}}>
																		<source
																			src={
																				post.fileUrl
																			}
																			type={
																				"video/mp4"
																			}
																		/>
																		<source
																			src={
																				post.fileUrl
																			}
																			type="video/ogg"
																		/>
																		<source
																			src={
																				post.fileUrl
																			}
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
														{!post?.fileUrl ||
															(post?.fileUrl?.includes(
																"audio"
															) && (
																<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:min-w-[6rem] aspect-square touch-auto">
																	<Image
																		width={
																			0
																		}
																		height={
																			0
																		}
																		placeholder="empty"
																		className="rounded-xl object-cover object-top w-full h-full"
																		src={
																			post
																				.user
																				.picture
																		}
																		alt={`${post.user.username} picture`}
																	/>
																</div>
															))}
														{post?.fileUrl ==
															null && (
															<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:min-w-[6rem] aspect-square touch-auto">
																<Image
																	width={0}
																	height={0}
																	placeholder="empty"
																	className="rounded-xl object-cover object-top w-full h-full"
																	src={
																		post
																			.user
																			.picture
																	}
																	alt={`${post.user.username} picture`}
																/>
															</div>
														)}
														<div className="flex flex-col ml-[1.2rem]">
															{post.title ? (
																<div className="">
																	<h2 className="text-clamp7 mob88:text-clamp1 line-clamp-1 font-medium mx-[1.2rem]">
																		{
																			post.title
																		}
																	</h2>
																</div>
															) : (
																<div></div>
															)}
															<div>
																<p className="line-clamp-2 text-clamp1 mob88:text-clamp2 mx-[1.2rem] mt-[0.8rem] mb-[1.2rem] mob88:mb-[0.2rem]">
																	{
																		post.content
																	}
																</p>
															</div>
														</div>
													</div>
													<GoToPostSparkleBtn
														post={post}
														setTrendBlur={setBlur}
														setTrendShown={
															setTrendShown
														}
														isTrend={isTrend}
													/>
												</div>
											</div>
										))}
									</FocusOn>
								</div>
							</motion.section>
						)}
					</AnimatePresence>
				</>
			)}

			{isBiggerDevice && (
				<>
					<div className="flex flex-col border-2 border-apppastgreen dark:border-applightdark bg-apppastgreen dark:bg-applightdark pt-[0.8rem] pb-[1.4rem] rounded-2xl shadow-neatcard mt-[2.6rem] mb-[1.2rem] w-[94%]">
						<h2 className="text-center uppercase text-clamp5 mob88:text-clamp7 my-[1rem] font-semibold">
							Trending
						</h2>
						{trending.map((post, index) => (
							<div
								key={post.id}
								id={post.id}
								className="w-full h-full">
								<div
									className={`bg-white dark:bg-appstone w-[96%] mx-auto border-2 border-white dark:border-appstone rounded-xl shadow-card my-[0.8rem] relative`}>
									<div className="flex text-clamp6 mob88:text-[1.4rem] mx-[1.2rem] mt-[0.4rem] mb-[0.3rem]">
										<div className="flex items-end">
											{props.session?.user.user_id ===
											post.user_id ? (
												<p className="mb-[0.5rem]">
													You
												</p>
											) : (
												<a
													href={`/csian/${[
														post.user_id,
													]}?pi=${post.id}`}
													className={`px-[0.4rem] mb-[0.5rem] hover:text-appturq active:text-appturq ${
														clickedBtn === index &&
														usrLinkEffect &&
														"animate-resizeBtn"
													}`}
													onClick={() => {
														setClickedBtn(index);
														usrProfileLnk(
															`/csian/${[
																post.user_id,
															]}?pi=${post.id}`
														);
													}}
													onAnimationEnd={() =>
														setUsrLinkEffect(false)
													}>
													{post.user.username}
												</a>
											)}
										</div>
									</div>
									<div className="flex mx-[1.2rem] items-center">
										{post.fileUrl &&
											post.fileUrl?.includes("image") && (
												<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:h-[6rem] aspect-square touch-auto">
													<Image
														width={0}
														height={0}
														placeholder="empty"
														className="rounded-xl object-cover object-top w-full h-full"
														src={post.fileUrl}
														alt="post image"
													/>
												</div>
											)}
										{post.fileUrl &&
											post.fileUrl?.includes("video") && (
												<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:min-w-[6rem] aspect-square">
													<video
														id={post.id}
														width="100%"
														height="100%"
														controls
														style={{
															borderRadius:
																"12px",
														}}>
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
										{!post?.fileUrl ||
											(post?.fileUrl?.includes(
												"audio"
											) && (
												<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:min-w-[6rem] aspect-square touch-auto">
													<Image
														width={0}
														height={0}
														placeholder="empty"
														className="rounded-xl object-cover object-top w-full h-full"
														src={post.user.picture}
														alt={`${post.user.username} picture`}
													/>
												</div>
											))}
										{post?.fileUrl == null && (
											<div className="flex w-[9rem] min-w-[9rem] mob88:w-[6rem] mob88:min-w-[6rem] aspect-square touch-auto">
												<Image
													width={0}
													height={0}
													placeholder="empty"
													className="rounded-xl object-cover object-top w-full h-full"
													src={post.user.picture}
													alt={`${post.user.username} picture`}
												/>
											</div>
										)}
										<div className="flex flex-col ml-[1.2rem]">
											{post.title ? (
												<div className="">
													<h2 className="text-clamp7 mob88:text-clamp1 line-clamp-1 font-medium mx-[1.2rem]">
														{post.title}
													</h2>
												</div>
											) : (
												<div></div>
											)}
											<div>
												<p className="line-clamp-2 text-clamp1 mob88:text-clamp2 mx-[1.2rem] mt-[0.8rem] mb-[1.2rem] mob88:mb-[0.2rem]">
													{post.content}
												</p>
											</div>
										</div>
									</div>
									<GoToPostSparkleBtn
										post={post}
										setTrendBlur={setBlur}
										setTrendShown={setTrendShown}
										isTrend={isTrend}
									/>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
}

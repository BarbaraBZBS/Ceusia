"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMagnifyingGlass,
	faMagnifyingGlassArrowRight,
	faXmark,
	faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import GoToPostSparkleBtn from "../motions/goToPostSparkleBtn";

export default function Search() {
	const { data: session } = useSession();
	const axiosAuth = useAxiosAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [showSearchBtnEffect, setShowSearchBtnEffect] = useState(false);
	const [showSearchInput, setShowSearchInput] = useState(false);
	const [searchBtnEffect, setSearchBtnEffect] = useState(false);
	const [closeSearchEffect, setCloseSearchEffect] = useState(false);
	const [blur, setBlur] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [pstsResults, setPstsResults] = useState([]);
	const [usrsResults, setUsrsResults] = useState([]);
	const [usrLinkEffect, setUsrLinkEffect] = useState(false);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [goToPostEffect, setGoToPostEffect] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [isSearch, setIsSearch] = useState(true);

	const {
		register,
		handleSubmit,
		getValues,
		watch,
		setFocus,
		formState: { errors },
	} = useForm({
		defaultValues: {
			search: "",
		},
		mode: "onSubmit",
	});
	const src = watch("search");

	const handleSearch = () => {
		setShowSearchBtnEffect(true);
		setShowResult(false);
		setTimeout(() => {
			setShowSearchInput(true);
			document.getElementById("body-container").style.overflow = "hidden";
		}, 400);
	};

	useEffect(() => {
		if (showSearchInput) {
			setTimeout(() => {
				setBlur(true);
				setFocus("search");
			}, 800);
		}
	}, [showSearchInput, setFocus]);

	const handleClose = () => {
		setCloseSearchEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 390);
		setTimeout(() => {
			setShowSearchInput(false);
			setShowResult(false);
			document.getElementById("body-container").style.overflow = "";
		}, 400);
	};

	const submitSearch = async () => {
		setIsLoading(true);
		setErrMsg("");
		let pResultsArrays = [];
		let pFlat = [];
		let uResultsArray = [];
		try {
			const res = await axiosAuth.get(`/posts/all`);
			const resp = await axiosAuth.get(`/auth/users`);
			// posts search
			const ptResults = res.data.filter((post) => {
				return post.title
					?.toLowerCase()
					.includes(getValues("search").toLowerCase());
			});
			const pcResults = res.data.filter((post) => {
				return post.content
					.toLowerCase()
					.includes(getValues("search").toLowerCase());
			});
			const pfResults = res.data.filter((post) => {
				return post.fileUrl
					?.toLowerCase()
					.includes(getValues("search").toLowerCase());
			});
			const plResults = res.data.filter((post) => {
				return post.link
					?.toLowerCase()
					.includes(getValues("search").toLowerCase());
			});
			const puResults = res.data.filter((post) => {
				return post.user.username
					.toLowerCase()
					.includes(getValues("search").toLowerCase());
			});
			pResultsArrays.push(
				ptResults,
				pcResults,
				pfResults,
				plResults,
				puResults
			);
			pResultsArrays.forEach((flatten) => {
				pFlat = pFlat.concat(flatten);
			});
			const mergedP = [...new Set(pFlat)];
			setPstsResults(mergedP);
			// users search
			const uResults = resp.data.filter((user) => {
				return user.username
					.toLowerCase()
					.includes(getValues("search").toLowerCase());
			});
			uResults.map((user) => {
				if (
					user.id !== session.user.user_id &&
					!user.username.startsWith("CsAdmin")
				) {
					return uResultsArray.push(user);
				}
			});
			setUsrsResults(uResultsArray);
			setTimeout(() => {
				setShowResult(true);
			}, 700);
		} catch (err) {
			if (!err.response) {
				console.log("searching server err : ", err);
				setErrMsg("No server response.");
			} else {
				console.log("searching err : ", err);
				setErrMsg("Sorry something went wrong.");
			}
		}
	};

	const usrProfileLnk = () => {
		setUsrLinkEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			setShowSearchInput(false);
			setShowResult(false);
			document.getElementById("body-container").style.overflow = "";
		}, 500);
	};

	useEffect(() => {
		if (showResult) {
			setTimeout(() => {
				setIsLoading(false);
			}, 800);
		}
	}, [showResult, pstsResults, usrsResults]);

	useEffect(() => {
		if (!src) {
			setShowResult(false);
		}
	}, [src]);

	return (
		<>
			{session && (
				<aside
					className="flex justify-end m-[0.8rem]"
					title="show search">
					<FontAwesomeIcon
						icon={faMagnifyingGlass}
						onClick={() => {
							handleSearch();
						}}
						onAnimationEnd={() => setShowSearchBtnEffect(false)}
						className={`cursor-pointer text-clamp1 hover:opacity-50 ${
							showSearchBtnEffect && "animate-pressed"
						}`}
					/>
				</aside>
			)}
			<AnimatePresence>
				{showSearchInput && (
					<motion.div
						key="search-card"
						initial={{ opacity: 0, y: 100, x: 100 }}
						animate={{ opacity: 1, y: 0, x: 0 }}
						exit={{ opacity: 0, y: 100, x: 100 }}
						transition={{ duration: 0.4, origin: 1, delay: 0.25 }}
						className={`z-[700] w-full top-0 left-0 h-full fixed overflow-auto ${
							blur && "animate-pop"
						}`}>
						<div className="bg-appopstone absolute top-[9.6rem] left-[4.5%] p-3 w-[90%] min-h-[18rem] rounded-xl shadow-neatcard overflow-auto">
							<div className="flex justify-end">
								<FontAwesomeIcon
									icon={faXmark}
									size="2xl"
									onClick={() => handleClose()}
									onAnimationEnd={() =>
										setCloseSearchEffect(false)
									}
									className={`cursor-pointer hover:text-appred ${
										closeSearchEffect &&
										"animate-pressed opacity-60"
									}`}
								/>
							</div>
							<form
								onSubmit={handleSubmit(submitSearch)}
								className="flex justify-center m-[1.6rem] text-clamp1">
								<input
									type="text"
									placeholder="Search"
									{...register("search")}
									className="border-2 border-appstone rounded-md h-[2.4rem] mx-[0.8rem] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] text-center focus:border-apppink focus:outline-none"
								/>
								<button
									type="submit"
									disabled={!src}
									title="search"
									onClick={() => setSearchBtnEffect(true)}
									onAnimationEnd={() =>
										setSearchBtnEffect(false)
									}
									className={`bg-appstone text-white w-[3.3rem] h-[3.2rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50
                                    ${searchBtnEffect && "animate-pressDown"}`}>
									<FontAwesomeIcon
										icon={faMagnifyingGlassArrowRight}
										size="lg"
									/>
								</button>
							</form>
							<div className="flex justify-center items-center">
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
							<AnimatePresence>
								{showResult &&
									(isLoading ? (
										<div className="flex w-full justify-center h-[104px] mt-10">
											<FontAwesomeIcon
												icon={faSpinner}
												spinPulse
												className="text-apppastgreen text-[3.2rem]"
											/>
										</div>
									) : pstsResults?.length > 0 ||
									  usrsResults?.length > 0 ? (
										<motion.div
											layout
											key="result-displayed"
											initial={{ opacity: 0, y: 50 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{
												opacity: 0,
												y: 50,
												transition: {
													ease: "easeOut",
													duration: 0.4,
												},
											}}
											transition={{
												type: "spring",
												delay: 0.2,
											}}
											className="">
											<h1 className="text-center text-clamp5 mb-[2rem] font-medium">
												__ Search result __
											</h1>
											{usrsResults?.length > 0 && (
												<h2 className="text-clamp5">
													Ceusians
												</h2>
											)}
											{usrsResults?.map((usr, index) => (
												<div key={usr.id}>
													<div className="flex justify-start items-center mx-[1.6rem] mt-[0.8rem] mb-[1.6rem]">
														<div className="w-[3.2rem] h-[3.2rem] rounded-full border-[1px] border-gray-300 mr-[1.6rem]">
															<Image
																width={0}
																height={0}
																placeholder="empty"
																className="rounded-full object-cover w-full h-full"
																src={
																	usr.picture
																}
																alt={`${usr.username} picture`}
															/>
														</div>
														<nav
															className={`hover:text-appturq active:text-appturq text-clamp5 ${
																clickedBtn ===
																	index &&
																usrLinkEffect &&
																"animate-resizeBtn"
															}`}
															onClick={() => {
																setClickedBtn(
																	index
																);
																usrProfileLnk();
															}}
															onAnimationEnd={() =>
																setUsrLinkEffect(
																	false
																)
															}>
															<a
																href={`/csian/${[
																	usr.id,
																]}`}>
																{usr.username}
															</a>
														</nav>
													</div>
												</div>
											))}
											{pstsResults?.length > 0 && (
												<h3 className="text-clamp5">
													Posts
												</h3>
											)}
											{pstsResults?.map((pst, index) => (
												<div key={pst.id}>
													<div
														className={`bg-white m-auto border-2 rounded-lg shadow-md my-[0.8rem] relative`}>
														<div className="flex text-clamp6 mx-[1.6rem] mt-[0.3rem]">
															{session?.user
																.user_id ===
															pst.user_id ? (
																<p>You</p>
															) : (
																<p>
																	{
																		pst.user
																			.username
																	}
																</p>
															)}
														</div>
														<div className="flex mx-[1.2rem] items-center">
															{pst.fileUrl &&
																pst.fileUrl?.includes(
																	"image"
																) && (
																	<div className="flex w-[6rem] min-w-[6rem] aspect-square touch-auto">
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
																				pst.fileUrl
																			}
																			alt="post image"
																		/>
																	</div>
																)}
															{pst.fileUrl &&
																pst.fileUrl?.includes(
																	"video"
																) && (
																	<div className="flex w-[6rem] min-w-[6rem] aspect-square">
																		<video
																			id={
																				pst.id
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
																					pst.fileUrl
																				}
																				type={
																					"video/mp4"
																				}
																			/>
																			<source
																				src={
																					pst.fileUrl
																				}
																				type="video/ogg"
																			/>
																			<source
																				src={
																					pst.fileUrl
																				}
																				type="video/webM"
																			/>
																			Your
																			browser
																			does
																			not
																			support
																			HTML5
																			video.{" "}
																		</video>
																	</div>
																)}
															{!pst.fileUrl ||
																(pst.fileUrl?.includes(
																	"audio"
																) && (
																	<div className="flex w-[9rem] min-w-[9rem] aspect-square touch-auto">
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
																				pst
																					.user
																					.picture
																			}
																			alt={`${pst.user.username} picture`}
																		/>
																	</div>
																))}
															{pst.fileUrl ==
																null && (
																<div className="flex w-[6rem] min-w-[rem] aspect-square touch-auto">
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
																			pst
																				.user
																				.picture
																		}
																		alt={`${pst.user.username} picture`}
																	/>
																</div>
															)}
															<div className="flex flex-col ml-[1.2rem]">
																{pst.title ? (
																	<div className="">
																		<h2 className="text-clamp7 line-clamp-1 font-medium mx-[0.8rem]">
																			{
																				pst.title
																			}
																		</h2>
																	</div>
																) : (
																	<div></div>
																)}
																<div>
																	<p className="line-clamp-2 text-clamp1 mx-[0.8rem] my-[0.4rem]">
																		{
																			pst.content
																		}
																	</p>
																</div>
															</div>
														</div>
														<GoToPostSparkleBtn
															post={pst}
															setSearchBlur={
																setBlur
															}
															setShowSearchInput={
																setShowSearchInput
															}
															setShowResult={
																setShowResult
															}
															isSearch={isSearch}
														/>
													</div>
												</div>
											))}
										</motion.div>
									) : (
										<div className="flex text-clamp7 h-[11.2rem] m-[1.6rem] p-[1.2rem]">
											<motion.p
												layout
												key="no-result"
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{
													opacity: 0,
													y: 50,
													transition: {
														ease: "easeOut",
														duration: 0.4,
													},
												}}
												transition={{
													type: "spring",
													delay: 0.2,
												}}>
												Sorry no result, check spelling
												or make another search.
											</motion.p>
										</div>
									))}
							</AnimatePresence>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

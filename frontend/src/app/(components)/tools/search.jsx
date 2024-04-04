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
import { FocusOn } from "react-focus-on";
import { RemoveScrollBar } from "react-remove-scroll-bar";

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
	const isDisabled = !src;

	//show search card function
	const handleSearch = () => {
		setShowSearchBtnEffect(true);
		setShowResult(false);
		setTimeout(() => {
			setShowSearchInput(true);
		}, 400);
	};

	//handle showing search result
	useEffect(() => {
		if (showSearchInput) {
			setTimeout(() => {
				setBlur(true);
				setFocus("search");
			}, 800);
		}
	}, [showSearchInput, setFocus]);

	//close search card function
	const handleClose = () => {
		setCloseSearchEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 390);
		setTimeout(() => {
			setShowSearchInput(false);
			setShowResult(false);
		}, 400);
	};

	//submit form
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

	//navigate to user profile function
	const usrProfileLnk = () => {
		setUsrLinkEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			setShowSearchInput(false);
			setShowResult(false);
		}, 500);
	};

	//hide spinner if result
	useEffect(() => {
		if (showResult) {
			setTimeout(() => {
				setIsLoading(false);
			}, 800);
		}
	}, [showResult, pstsResults, usrsResults]);

	//hide results if no input
	useEffect(() => {
		if (!src) {
			setShowResult(false);
		}
	}, [src]);

	return (
		<>
			{session && (
				<aside aria-label="Search" className="flex justify-end">
					<button
						aria-labelledby="Search"
						title="Open search"
						onClick={() => {
							handleSearch();
						}}
						className="p-[0.4rem] pr-[0.8rem]">
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							onAnimationEnd={() => setShowSearchBtnEffect(false)}
							className={`cursor-pointer text-clamp1 mob88:text-[1.2rem] hover:opacity-50 ${
								showSearchBtnEffect && "animate-pressed"
							}`}
						/>
					</button>
				</aside>
			)}
			<AnimatePresence>
				{showSearchInput && (
					<>
						<RemoveScrollBar />
						<motion.div
							key="search-card"
							initial={{ opacity: 0, y: 100, x: 100 }}
							animate={{ opacity: 1, y: 0, x: 0 }}
							exit={{ opacity: 0, y: 100, x: 100 }}
							transition={{
								duration: 0.4,
								origin: 1,
								delay: 0.25,
							}}
							className={`z-[700] w-screen top-0 left-0 h-full fixed overflow-scroll popmod ${
								blur && "animate-pop"
							}`}>
							<FocusOn
								onClickOutside={() => {
									handleClose();
								}}
								onEscapeKey={() => {
									handleClose();
								}}
								preventScrollOnFocus
								noIsolation
								scrollLock={false}>
								<div
									role="dialog"
									aria-labelledby="srch-ttl"
									className="bg-appopstone dark:bg-applightdark absolute top-[7.6rem] left-[calc(50vw-(95vw/2))] p-3 w-[95%] min-h-[18rem] rounded-xl shadow-neatcard">
									<div className="flex justify-end">
										<button
											title="Close Search"
											onClick={() => handleClose()}>
											<FontAwesomeIcon
												icon={faXmark}
												size="2xl"
												onAnimationEnd={() =>
													setCloseSearchEffect(false)
												}
												className={`cursor-pointer hover:text-appred ${
													closeSearchEffect &&
													"animate-pressed opacity-60"
												}`}
											/>
										</button>
									</div>
									<h1
										id="srch-ttl"
										className="text-center uppercase text-clamp3 mob00:text-clamp5">
										Search
									</h1>
									<form
										onSubmit={handleSubmit(submitSearch)}
										role="search"
										className="flex justify-center items-center m-[1.6rem] text-clamp7">
										<input
											type="search"
											placeholder="Search"
											{...register("search")}
											className="border-2 border-appstone rounded-md h-[2.4rem] mx-[0.8rem] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] text-center focus:border-apppink focus:outline-none"
										/>
										<button
											type="submit"
											aria-disabled={isDisabled}
											title="Launch Search"
											onClick={(e) => {
												isDisabled
													? e.preventDefault()
													: setSearchBtnEffect(true);
											}}
											onAnimationEnd={() =>
												setSearchBtnEffect(false)
											}
											className={`bg-appstone dark:bg-appmauvedark text-white w-[3.3rem] h-[3.2rem] mob00:w-[2.7rem] mob00:h-[2.6rem] rounded-xl mt-[0.8rem] mb-[0.8rem] 
                                    ${searchBtnEffect && "animate-pressDown"} ${
												isDisabled
													? "opacity-50 cursor-not-allowed"
													: "transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue "
											}`}>
											<FontAwesomeIcon
												icon={
													faMagnifyingGlassArrowRight
												}
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
													role="alert"
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
													initial={{
														opacity: 0,
														y: 50,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
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
													{usrsResults?.length >
														0 && (
														<h2 className="text-clamp5">
															Ceusians
														</h2>
													)}
													{usrsResults?.map(
														(usr, index) => (
															<div key={usr.id}>
																<div className="flex justify-start items-center mx-[1.6rem] mt-[0.8rem] mb-[1.6rem]">
																	<div className="w-[3.2rem] h-[3.2rem] rounded-full border-[1px] border-gray-300 mr-[1.6rem]">
																		<Image
																			width={
																				0
																			}
																			height={
																				0
																			}
																			placeholder="empty"
																			className="rounded-full object-cover w-full h-full"
																			src={`${process.env.NEXT_PUBLIC_API}${usr.picture}`}
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
																			className="block px-[0.5rem]"
																			href={`/csian/${[
																				usr.id,
																			]}`}>
																			{
																				usr.username
																			}
																		</a>
																	</nav>
																</div>
															</div>
														)
													)}
													{pstsResults?.length >
														0 && (
														<h3 className="text-clamp5">
															Posts
														</h3>
													)}
													{pstsResults?.map(
														(pst, index) => (
															<div key={pst.id}>
																<div
																	className={`bg-white dark:bg-appmauvedarker dark:border-appmauvedarker m-auto border-2 rounded-lg shadow-md my-[0.8rem] relative`}>
																	<div className="flex text-clamp6 mx-[1.6rem] mt-[0.3rem]">
																		{session
																			?.user
																			.user_id ===
																		pst.user_id ? (
																			<p>
																				You
																			</p>
																		) : (
																			<p>
																				{
																					pst
																						.user
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
																						src={`${process.env.NEXT_PUBLIC_API}${pst.fileUrl}`}
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
																						src={`${process.env.NEXT_PUBLIC_API}${pst.user.picture}`}
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
																					src={`${process.env.NEXT_PUBLIC_API}${pst.user.picture}`}
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
																		post={
																			pst
																		}
																		setSearchBlur={
																			setBlur
																		}
																		setShowSearchInput={
																			setShowSearchInput
																		}
																		setShowResult={
																			setShowResult
																		}
																		isSearch={
																			isSearch
																		}
																	/>
																</div>
															</div>
														)
													)}
												</motion.div>
											) : (
												<div className="flex text-clamp7 h-[11.2rem] m-[1.6rem] p-[1.2rem]">
													<motion.p
														layout
														key="no-result"
														initial={{
															opacity: 0,
															y: 50,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
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
														Sorry no result, check
														spelling or make another
														search.
													</motion.p>
												</div>
											))}
									</AnimatePresence>
								</div>
							</FocusOn>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

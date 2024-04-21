"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faXmark,
	faPhotoFilm,
	faCheckDouble,
	faPenFancy,
	faEraser,
	faImagePortrait,
	faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import FollowersFollowing from "./followersFollowing";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { logout } from "@/app/actions";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FocusOn } from "react-focus-on";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import Loading from "../loading";

const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/;
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9])/;

export default function LoggedUser({ user }) {
	const axiosAuth = useAxiosAuth();
	const { data: session, update } = useSession();
	const [userDetail, setUserDetail] = useState(user);
	const isBrowser = () => typeof window !== "undefined";
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		setError,
		setFocus,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			username: "",
			email: "",
			currpsw: "",
			password: "",
			confirm_password: "",
			motto: "",
			picture: "",
		},
		mode: "onSubmit",
	});
	const password = useRef({});
	password.current = watch("password", "");
	const filewatch = watch("picture");
	const usrN = watch("username");
	const eml = watch("email");
	const curpsw = watch("currpsw");
	const psw = watch("password");
	const confpasw = watch("confirm_password");
	const mt = watch("motto");
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [errMsgDel, setErrMsgDel] = useState("");
	const [passwordUpdated, setPasswordUpdated] = useState(false);
	const [pictureUpdated, setPictureUpdated] = useState(false);
	const [usrnEffect, setUsrnEffect] = useState(false);
	const [emailEffect, setEmailEffect] = useState(false);
	const [pwdEffect, setPwdEffect] = useState(false);
	const [mottoEffect, setMottoEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [picEffect, setPicEffect] = useState(false);
	const [deleteEffect, setDeleteEffect] = useState(false);
	const [pswUpdatedEffect, setPswUpdatedEffect] = useState(false);
	const [resetBtnEffect, setResetBtnEffect] = useState(false);
	const [bgZoomed, setBgZoomed] = useState(false);
	const [defaultPicEffect, setDefaultPicEffect] = useState(false);
	const [userPosts, setUserPosts] = useState(false);
	const [isPostsShown, setIsPostsShown] = useState(false);
	const [closeUserPostsEffect, setCloseUserPostsEffect] = useState(false);
	const [isBlurred, setIsBlurred] = useState(false);
	const [postsErrMsg, setPostsErrMsg] = useState("");
	const [scope, animate] = useAnimate();
	const [goToPostEffect, setGoToPostEffect] = useState(false);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [emojiBtnClickEffect, setEmojiBtnClickEffect] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const isBtnUsrnDisabled = !usrN;
	const isBtnEmlDisabled = !eml;
	const isBtnPswDisabled = !curpsw || !psw || !confpasw;
	const isBtnMtDisabled = !mt;
	const isBtnImgDisabled = filewatch === null || !filewatch?.[0]?.name;
	const isBtnPicDisabled = user.picture === "/profile/defaultUser.png";

	//set focus on inputs if error
	useEffect(() => {
		if (errors?.username) {
			setFocus("username");
		} else if (errors?.email) {
			setFocus("email");
		} else if (errors?.password) {
			setFocus("password");
		}
	});

	//show user posts function
	const showPosts = () => {
		setPostsErrMsg("");
		animate([
			["button", { scale: 0.8 }, { duration: 0.1, at: "<" }],
			["button", { scale: 1 }, { duration: 0.1 }],
		]);
		setTimeout(() => {
			setIsPostsShown(true);
		}, 300);
		setTimeout(async () => {
			try {
				const myPosts = await axiosAuth.get(
					`/posts/user/${session.user.user_id}`
				);
				setUserPosts(myPosts.data);
			} catch (err) {
				if (!err?.response) {
					setPostsErrMsg("Server unresponsive.");
				} else {
					setPostsErrMsg(
						"Unable to retrieve your posts, please try again."
					);
				}
			}
		}, 400);
		setTimeout(() => {
			setIsBlurred(true);
		}, 900);
	};

	//close user posts function
	const handleClose = () => {
		setCloseUserPostsEffect(true);
		setTimeout(() => {
			setIsBlurred(false);
		}, 390);
		setTimeout(() => {
			setIsPostsShown(false);
		}, 400);
	};

	//handle navigate to post link function
	const goToPost = () => {
		setGoToPostEffect(true);
		setTimeout(() => {
			setIsBlurred(false);
		}, 490);
		setTimeout(() => {
			setIsPostsShown(false);
		}, 500);
	};

	//submit form
	const submitUpdate = async (data) => {
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setErrMsg();
		setErrMsgDel();
		setIsSent(false);
		data = {
			username: getValues("username"),
			email: getValues("email"),
			currpsw: getValues("currpsw"),
			password: getValues("password"),
			motto: getValues("motto"),
		};
		try {
			await axiosAuth({
				method: "put",
				url: `/auth/user/${user.id}`,
				data: data,
			}).then(async (response) => {
				const resData = JSON.parse(response.config.data);
				if (getValues("password") != "") {
					setPasswordUpdated(true);
					setPswUpdatedEffect(true);
				}
				if (getValues("username") != "") {
					const updSession = {
						...session,
						user: {
							...session?.user,
							username: resData.username,
						},
					};
					await update(updSession);
				}
				setIsSent(true);
				const resp = await axiosAuth.get(`/auth/user/${user.id}`);
				const userInfo = resp.data;
				setUserDetail(userInfo);
			});
		} catch (err) {
			if (!err?.response) {
				setErrMsg(
					"Server unresponsive, please try again or come back later."
				);
			} else if (err.response?.status === 401) {
				setError("currpsw", {
					type: "custom",
					message: "Incorrect password detail",
				});
				setFocus("currpsw");
			} else if (err.response?.status === 409) {
				setError("username", {
					type: "custom",
					message: "Username already taken",
				});
				setFocus("username");
			} else if (err.response?.status === 403) {
				setError("email", {
					type: "custom",
					message: "This email is already linked",
				});
				setFocus("email");
			} else {
				setErrMsg("Update failed, please try again.");
			}
		}
	};

	//submit form for profile picture function
	const submitPicUpdate = async (data) => {
		if (data.picture <= 0) {
			return;
		}
		const form = new FormData();
		form.append("picture", data.picture[0]);
		//console.log("file upload? : ", form);
		const headers = {
			"Content-Type": "multipart/form-data",
		};
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setErrMsg("");
		setErrMsgDel("");
		setIsSent(false);
		const abortSignal = AbortSignal.timeout(4000);
		try {
			await axiosAuth({
				method: "post",
				url: `/auth/user/${user.id}/upload`,
				data: form,
				headers: headers,
				signal: abortSignal,
			}).then(async (response) => {
				if (response) {
					//console.log("response data: ", response?.data);
					//console.log("updated");
					const resp = await axiosAuth.get(`/auth/user/${user.id}`);
					setIsSent(true);
					setUserDetail(resp.data);
					setPictureUpdated(true);
				}
			});
		} catch (err) {
			if (err.code === "ERR_CANCELED" && abortSignal.aborted) {
				setErrMsg(
					"Request timed out, please try again or chose another file."
				);
			} else if (!err?.response) {
				setErrMsg(
					"Server unresponsive, please try again or come back later."
				);
			} else if (err.response?.status === 409) {
				setError("picture", {
					type: "custom",
					message: "Max size reached. (8Mb max)",
				});
			} else if (err.response?.status === 403) {
				setError("picture", {
					type: "custom",
					message: "Bad file type. (video, picture or audio only)",
				});
			} else {
				setErrMsg("Update failed, please try again.");
			}
		}
	};

	//handle delete user account function
	const handleDelete = async () => {
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setDeleteEffect(true);
		setErrMsg();
		setErrMsgDel();
		let answer = window.confirm(
			"LAST CONFIRMATION : Are you sure you want to delete your account?"
		);
		if (answer) {
			if (!isBrowser()) return;
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
			setIsLoading(true);
			setTimeout(async () => {
				try {
					await axiosAuth({
						method: "delete",
						url: `/auth/user/${user.id}`,
					}).then(() => {
						//console.log("account removed !");
						signOut({ callbackUrl: "/" });
					});
					logout();
				} catch (err) {
					if (!err?.response) {
						setIsLoading(false);
						setErrMsgDel(
							"Server unresponsive, please try again or come back later."
						);
					} else {
						setIsLoading(false);
						setErrMsgDel(
							"Account removal failed, please try again."
						);
					}
				}
			}, 600);
		}
	};

	//reset form after submit if ok
	useEffect(() => {
		if (isSubmitSuccessful && isSent) {
			setErrMsg("");
			setErrMsgDel("");
			reset();
		}
	}, [isSubmitSuccessful, isSent, reset]);

	//show and hide user picture zoom functions
	function showUsrPicZoomOverlay() {
		setBgZoomed(true);
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
		setBgZoomed(false);
	}

	//reset user profile picture to default
	const restoreDefault = () => {
		setDefaultPicEffect(true);
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setErrMsg();
		const data = { picture: "" };
		setTimeout(async () => {
			try {
				await axiosAuth({
					method: "post",
					url: `/auth/user/${user.id}/upload`,
					data: data,
				}).then(async (response) => {
					if (response) {
						//console.log("response data: ", response.data);
						//console.log("updated and restored default pic");
						const resp = await axiosAuth.get(
							`/auth/user/${user.id}`
						);
						setUserDetail(resp.data);
						setPictureUpdated(true);
					}
				});
			} catch (err) {
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				} else {
					setErrMsg("Update failed, please try again.");
				}
			}
		}, 700);
	};

	//hide or show emoji picker function
	const handleEmojiPickerHideShow = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	//manage clicking emoji function
	const handleEmojiClick = (emoji) => {
		let message = getValues("motto");
		message += emoji.emoji;
		setValue("motto", message);
	};

	//manage how emoji picker is opened
	const handleShowEmoji = () => {
		setEmojiBtnClickEffect(true);
		setTimeout(() => {
			handleEmojiPickerHideShow();
		}, 400);
	};

	//remember scroll position when picture zooming
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
				<div className="flex flex-col mb-[2.4rem]">
					{/* profile info */}
					<h1 className="text-clamp3 mob48:text-clamp5 text-center pt-[3.2rem] mb-[2rem] uppercase font-semibold">
						My Profile
					</h1>
					<section className="flex flex-col text-clamp8 mob48:text-clamp7 items-center mb-[3.2rem] gap-[1rem]">
						<p>{userDetail.username}</p>
						<p>{userDetail.email}</p>
						{userDetail.motto == "" || userDetail.motto == null ? (
							<p>no motto</p>
						) : (
							<p className="mx-[0.8rem]">{` ${userDetail.motto} `}</p>
						)}
						<FollowersFollowing user={user} />
						<button
							title="click or press enter to zoom in"
							onClick={() => showUsrPicZoomOverlay()}
							className="w-[12.8rem] h-[12.8rem] rounded-full focus-visible:outline-offset-[0.4rem] touch-auto transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light">
							<Image
								width={0}
								height={0}
								priority={true}
								src={`${process.env.NEXT_PUBLIC_API}${userDetail.picture}`}
								alt={`${userDetail.username} picture`}
								placeholder="empty"
								className="rounded-full w-full h-full border-2 shadow-strip"
							/>
						</button>
						{bgZoomed && (
							<FocusOn
								onEscapeKey={() => {
									hideUsrPicZoomOverlay();
								}}>
								<div
									className={
										bgZoomed
											? "fixed overflow-y-auto left-0 right-0 top-0 bottom-0 w-screen h-full bg-white dark:bg-appblck z-[998] flex"
											: "hidden"
									}
									onClick={() => hideUsrPicZoomOverlay()}>
									{bgZoomed && (
										<Image
											tabIndex={0}
											title="click or press escape to zoom out"
											width={0}
											height={0}
											priority={true}
											src={`${process.env.NEXT_PUBLIC_API}${userDetail.picture}`}
											placeholder="empty"
											alt={`zoomed ${userDetail.username} picture`}
											className="block m-auto w-[96%] aspect-square object-cover rounded-full border-2 animate-resizeZoom"
										/>
									)}
								</div>
							</FocusOn>
						)}
					</section>

					{/* logged user posts */}
					<div
						ref={scope}
						className="flex justify-center mt-[1.2rem] mb-[2.5rem] sm:mb-[3.5rem]">
						<button
							onClick={() => showPosts()}
							className="border-[0.3rem] border-appmauvedark dark:border-apppastgreen text-appmauvedark text-clamp8 uppercase font-bold bg-apppastgreen rounded-full px-[0.8rem] py-[0.4rem] hover:bg-indigo-100 focus-visible:outline-offset-[0.4rem] shadow-neatcard">
							My posts
						</button>
					</div>
					<AnimatePresence>
						{postsErrMsg && (
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
								className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 mb-[2rem]"
								role="alert"
								aria-live="assertive">
								{postsErrMsg}
							</motion.p>
						)}
					</AnimatePresence>

					{/* user posts shown */}
					<AnimatePresence>
						{isPostsShown && (
							<>
								<RemoveScrollBar />
								<motion.section
									key="user-posts-card"
									initial={{ opacity: 0, y: 100, x: 100 }}
									animate={{ opacity: 1, y: 0, x: 0 }}
									exit={{ opacity: 0, y: 100, x: 100 }}
									transition={{
										duration: 0.4,
										origin: 1,
										delay: 0.25,
									}}
									className={`z-[700] w-screen top-0 left-0 h-full fixed overflow-scroll popmod ${
										isBlurred && "animate-pop"
									}`}>
									<FocusOn
										onClickOutside={() => handleClose()}
										onEscapeKey={() => handleClose()}
										preventScrollOnFocus
										noIsolation
										scrollLock={false}>
										<div
											role="dialog"
											aria-labelledby="posts-ttl"
											className="bg-gray-200 dark:bg-applightdark absolute top-[7.6rem] left-[calc(50vw-(94vw/2))] p-3 w-[94%] min-h-[18rem] rounded-xl shadow-neatcard">
											<div className="flex justify-end mb-[1.2rem]">
												<button
													onClick={() =>
														handleClose()
													}
													aria-label="close posts"
													className="w-fit">
													<FontAwesomeIcon
														icon={faXmark}
														size="2xl"
														onAnimationEnd={() =>
															setCloseUserPostsEffect(
																false
															)
														}
														className={`hover:text-appred ${
															closeUserPostsEffect &&
															"animate-pressed opacity-60"
														}`}
													/>
												</button>
											</div>
											<h1
												id="posts-ttl"
												className="uppercase text-clamp5 xt-center font-semibold">
												My Posts
											</h1>
											<AnimatePresence>
												{userPosts.length > 0 ? (
													<motion.section
														key="user-posts-list"
														layout
														initial={{
															opacity: 0,
															x: -50,
														}}
														animate={{
															opacity: 1,
															x: 0,
														}}
														exit={{
															opacity: 0,
															x: -50,
															transition: {
																ease: "easeOut",
																duration: 0.4,
															},
														}}
														transition={{
															type: "spring",
															delay: 0.7,
														}}
														className="mt-[3rem] overflow-hidden w-full">
														{userPosts &&
															userPosts.map(
																(
																	post,
																	index
																) => (
																	<div
																		key={
																			post.id
																		}
																		onClick={() => {
																			setClickedBtn(
																				index
																			);
																			goToPost();
																		}}
																		className={`cursor-pointer border-2 border-gray-400 dark:border-gray-800 rounded-2xl bg-white dark:bg-appstone my-[0.8rem] text-clamp1 dark:hover:bg-appmauvedark hover:bg-appmauvelight ${
																			clickedBtn ===
																				index &&
																			goToPostEffect &&
																			"border-violet-500 bg-violet-200 dark:border-violet-700 dark:bg-violet-400 animate-clicked"
																		}`}
																		onAnimationEnd={() =>
																			setGoToPostEffect(
																				false
																			)
																		}>
																		<a
																			aria-labelledby={
																				post.title
																					? "list-post-ttl"
																					: `post ${index}`
																			}
																			href={`/coms/${[
																				post.id,
																			]}`}
																			className="block px-[1.4rem] py-[0.8rem] rounded-2xl">
																			<div className="">
																				{post.title && (
																					<>
																						<p
																							id="list-post-ttl"
																							className="text-clamp5 font-medium text-center mb-[0.4rem]">
																							{
																								post.title
																							}
																						</p>
																						<hr className="border-b-[1px]" />
																					</>
																				)}
																				<p className="line-clamp-1 mt-[0.4rem] mb-[0.6rem]">
																					{
																						post.content
																					}
																				</p>
																				<hr className="border-b-[1px]" />
																				<div className="flex justify-evenly font-semibold">
																					<p className="text-green-500 drop-shadow-lighter">
																						{
																							post.likes
																						}
																					</p>
																					<p className="text-red-500 drop-shadow-lighter">
																						{
																							post.dislikes
																						}
																					</p>
																					<p className="text-appturq drop-shadow-lighter">
																						{
																							post.discussions
																						}
																					</p>
																				</div>
																			</div>
																		</a>
																	</div>
																)
															)}
													</motion.section>
												) : (
													<motion.div
														key="user-posts-list-empty"
														layout
														initial={{
															opacity: 0,
															x: -50,
														}}
														animate={{
															opacity: 1,
															x: 0,
														}}
														exit={{
															opacity: 0,
															x: -50,
															transition: {
																ease: "easeOut",
																duration: 0.4,
															},
														}}
														transition={{
															type: "spring",
															delay: 0.7,
														}}
														className="flex flex-col items-center justify-center text-clamp7 mt-[3rem] overflow-hidden w-full">
														<p>
															You have shared no
															posts... 😢
														</p>
														<p>
															Go back to home feed
															to share something!
														</p>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</FocusOn>
								</motion.section>
							</>
						)}
					</AnimatePresence>

					{/* update forms */}
					<motion.section
						animate={{ opacity: [0, 1], y: [50, 0] }}
						transition={{ duration: 0.6, delay: 0.3 }}>
						<div className="flex flex-col items-center">
							<hr className="w-[80vw] text-center mb-[3.2rem] border-t-solid border-t-[4px] rounded-md border-t-gray-300 dark:border-t-gray-500"></hr>
							<h2 className="text-clamp3 mob48:text-clamp5 text-center mb-[2rem] uppercase font-semibold">
								Update Profile Details
							</h2>
						</div>
						<div className="flex flex-col items-center">
							<form
								className="mb-[0.4rem] py-[0.4rem] flex items-center justify-center text-clamp6 w-full gap-[1rem]"
								onSubmit={handleSubmit(submitUpdate)}>
								<input
									placeholder={`  ${userDetail.username}`}
									{...register("username", {
										minLength: {
											value: 4,
											message: "4 characters minimum",
										},
										maxLength: {
											value: 15,
											message: "15 characters maximum",
										},
										pattern: {
											value: USER_REGEX,
											message:
												"Username must start with letters (digits, -, _ allowed)",
										},
									})}
									className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[60%] ${
										errors.username
											? "border-appred focus:border-appred"
											: ""
									}`}
								/>
								<button
									title="confirm username update"
									type="submit"
									aria-disabled={isBtnUsrnDisabled}
									onClick={(e) => {
										isBtnUsrnDisabled
											? e.preventDefault()
											: setUsrnEffect(true);
									}}
									onAnimationEnd={() => setUsrnEffect(false)}
									className={`bg-appstone dark:bg-appmauvedark text-white w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] py-[0.4rem] px-[1rem] mob88:p-[0.2rem] shadow-neatcard ${
										usrnEffect && "animate-bgSize"
									} ${
										isBtnUsrnDisabled
											? "opacity-40 cursor-not-allowed"
											: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
									}`}>
									<FontAwesomeIcon icon={faPenFancy} />
								</button>
							</form>
							{errors.username && (
								<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
									{errors.username.message}
								</span>
							)}
						</div>

						<div className="flex flex-col items-center">
							<form
								className="mb-[0.4rem] py-[0.4rem] flex items-center justify-center text-clamp6 w-full gap-[1rem]"
								onSubmit={handleSubmit(submitUpdate)}>
								<input
									type="email"
									placeholder={`  ${userDetail.email}`}
									{...register("email", {
										pattern: {
											value: EMAIL_REGEX,
											message:
												"Email must have a valid format",
										},
									})}
									className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[60%] ${
										errors.email
											? "border-appred focus:border-appred"
											: ""
									}`}
								/>
								<button
									title="confirm email update"
									type="submit"
									aria-disabled={isBtnEmlDisabled}
									onClick={(e) => {
										isBtnEmlDisabled
											? e.preventDefault()
											: setEmailEffect(true);
									}}
									onAnimationEnd={() => setEmailEffect(false)}
									className={`bg-appstone dark:bg-appmauvedark text-white w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] py-[0.4rem] px-[1rem] mob88:p-[0.2rem] shadow-neatcard ${
										emailEffect && "animate-bgSize"
									} ${
										isBtnEmlDisabled
											? "opacity-40 cursor-not-allowed"
											: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
									}`}>
									<FontAwesomeIcon icon={faPenFancy} />
								</button>
							</form>
							{errors.email && (
								<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
									{errors.email.message}
								</span>
							)}
						</div>

						<div>
							<form
								className="mb-[0.4rem] py-[0.4rem] flex flex-col items-center text-clamp6"
								onSubmit={handleSubmit(submitUpdate)}>
								<div className="flex items-center justify-center w-full gap-[1rem]">
									<input
										type="password"
										autoComplete="off"
										placeholder="  Current Password"
										{...register("currpsw", {})}
										className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[60%] ${
											errors.currpsw
												? "border-appred focus:border-appred"
												: ""
										}`}
									/>
									<button
										aria-hidden
										tabIndex={-1}
										className="cursor-default w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] mob88:p-[0.2rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] py-[0.4rem] px-[1rem] opacity-0">
										<FontAwesomeIcon icon={faPenFancy} />
									</button>
								</div>
								{errors.currpsw && (
									<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
										{errors.currpsw.message}
									</span>
								)}

								<div className="flex items-center justify-center w-full gap-[1rem]">
									<input
										type="password"
										autoComplete="new-password"
										placeholder="  New Password"
										{...register("password", {
											minLength: {
												value: 6,
												message: "6 characters minimum",
											},
											maxLength: {
												value: 35,
												message:
													"35 characters maximum",
											},
											pattern: {
												value: PASSWORD_REGEX,
												message:
													"Password must have at least 1 digit and 1 letter",
											},
										})}
										className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[60%] ${
											errors.password
												? "border-appred focus:border-appred"
												: ""
										}`}
									/>
									{passwordUpdated ? (
										<button
											type="button"
											aria-hidden
											tabIndex={-1}
											className="cursor-default w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] mob88:p-[0.2rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] py-[0.4rem] px-[1rem]">
											<FontAwesomeIcon
												icon={faCheckDouble}
												size={"lg"}
												style={{ color: "#84CC16" }}
												className={` ${
													pswUpdatedEffect &&
													"animate-reversePing"
												}`}
												onAnimationEnd={() =>
													setPswUpdatedEffect(false)
												}
											/>
										</button>
									) : (
										<button
											type="button"
											aria-hidden
											tabIndex={-1}
											className="cursor-default w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] mob88:p-[0.2rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] py-[0.4rem] px-[1rem] opacity-0">
											<FontAwesomeIcon
												icon={faPenFancy}
											/>
										</button>
									)}
								</div>
								{errors.password && (
									<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
										{errors.password.message}
									</span>
								)}
								<div className="flex justify-center items-center w-full gap-[1rem]">
									<input
										type="password"
										autoComplete="off"
										placeholder="  Confirm New Password"
										{...register("confirm_password", {
											validate: (value) =>
												value === password.current ||
												"Passwords do not match",
										})}
										className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[60%] ${
											errors.confirm_password
												? "border-appred focus:border-appred"
												: ""
										}`}
									/>
									<button
										title="confirm password update"
										type="submit"
										aria-disabled={isBtnPswDisabled}
										onClick={() => setPwdEffect(true)}
										onAnimationEnd={(e) => {
											isBtnPswDisabled
												? e.preventDefault()
												: setPwdEffect(false);
										}}
										className={`bg-appstone dark:bg-appmauvedark text-white w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] py-[0.4rem] px-[1rem] mob88:p-[0.2rem] shadow-neatcard ${
											pwdEffect && "animate-bgSize"
										} ${
											isBtnPswDisabled
												? "opacity-40 cursor-not-allowed"
												: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
										}`}>
										<FontAwesomeIcon icon={faPenFancy} />
									</button>
								</div>
								{errors.confirm_password && (
									<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
										{errors.confirm_password.message}
									</span>
								)}
							</form>
						</div>

						<div className="flex flex-col items-center justify-center">
							<form
								className="py-[0.4rem] w-full flex justify-center items-center text-clamp6 mb-[0.9rem] gap-[1rem]"
								onSubmit={handleSubmit(submitUpdate)}>
								<textarea
									type="text"
									placeholder={
										userDetail.motto == "" ||
										userDetail.motto == null
											? "  Add your motto..."
											: `  ${userDetail.motto}`
									}
									{...register("motto")}
									className="border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred resize h-[9.6rem] max-[376px]:h-[7.6rem] w-[60%] min-w-[22rem] max-[376px]:min-w-[9rem] max-w-[85%] min-h-[2.7rem] max-h-[16rem] max-[376px]:max-h-[11rem] lg:max-[90%]"
								/>
								<div className="flex flex-col items-center">
									<BsEmojiSmileFill
										tabIndex={0}
										title={
											showEmojiPicker
												? "hide emoji picker"
												: "show emoji picker"
										}
										className={`text-[2.3rem] mob88:text-[1.8rem] text-yellow-300 bg-black rounded-full cursor-pointer drop-shadow-linkTxt ${
											emojiBtnClickEffect &&
											"animate-pressed"
										}`}
										onClick={() => handleShowEmoji()}
										onKeyUp={(e) => {
											if (e.key === "Enter")
												handleShowEmoji();
										}}
										onAnimationEnd={() =>
											setEmojiBtnClickEffect(false)
										}
									/>
									<button
										title="confirm motto update"
										type="submit"
										aria-disabled={isBtnMtDisabled}
										onClick={(e) => {
											isBtnMtDisabled
												? e.preventDefault()
												: setMottoEffect(true);
										}}
										onAnimationEnd={() =>
											setMottoEffect(false)
										}
										className={`bg-appstone dark:bg-appmauvedark text-white w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] py-[0.4rem] px-[1rem] mob88:p-[0.2rem] shadow-neatcard ${
											mottoEffect && "animate-bgSize"
										} ${
											isBtnMtDisabled
												? "opacity-40 cursor-not-allowed"
												: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
										}`}>
										<FontAwesomeIcon icon={faPenFancy} />
									</button>
								</div>
							</form>
							{/* emoji picker */}
							{showEmojiPicker && (
								<div className="">
									<Picker
										onEmojiClick={handleEmojiClick}
										className="bg-appmauvedark"
									/>
								</div>
							)}
						</div>

						<div className="flex flex-col items-center">
							<form
								className="py-[0.4rem] flex flex-col items-center text-clamp6 w-full"
								onSubmit={handleSubmit(submitPicUpdate)}>
								<div className="flex w-[60%] items-center justify-evenly">
									<button
										title="select picture"
										onClick={() => {
											setFileWiggle(true);
											document
												.getElementById("picture")
												.click();
										}}
										className={`relative hover:opacity-70 ml-[16%] rounded-md my-[0.4rem] w-[5.3rem] h-[3.6rem] ${
											fileWiggle && "animate-wiggle"
										}`}
										onAnimationEnd={() =>
											setFileWiggle(false)
										}>
										<input
											id="picture"
											type="file"
											name="picture"
											placeholder="  Update Profile Picture"
											{...register("picture")}
											className="hidden"
										/>
										<FontAwesomeIcon
											icon={faPhotoFilm}
											size="2xl"
											className="text-appstone dark:text-appmauvedark absolute left-[0px] top-[0.3rem] -z-20"
										/>
										<FontAwesomeIcon
											icon={faImagePortrait}
											size="xl"
											style={
												errors.picture
													? { color: "#FD2D01" }
													: { color: "#b1ae99" }
											}
											className="absolute left-[3.45rem] top-[1rem] -z-10"
										/>
									</button>
									<button
										type="submit"
										title="confirm picture update"
										aria-disabled={isBtnImgDisabled}
										onClick={(e) => {
											isBtnImgDisabled
												? e.preventDefault()
												: setPicEffect(true);
										}}
										onAnimationEnd={() =>
											setPicEffect(false)
										}
										className={`bg-appstone dark:bg-appmauvedark text-white w-fit mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] py-[0.4rem] px-[1rem] mob88:p-[0.2rem] ml-[24%] mr-[14%] shadow-neatcard ${
											picEffect && "animate-bgSize"
										} ${
											isBtnImgDisabled
												? "opacity-40 cursor-not-allowed"
												: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
										}`}>
										<FontAwesomeIcon icon={faPenFancy} />
									</button>
								</div>
								{filewatch && filewatch[0] ? (
									<p
										className={`max-w-[90%] mx-[0.8rem] text-ellipsis overflow-hidden 
                                ${
									errors.picture
										? "text-red-600 underline underline-offset-2 font-semibold"
										: ""
								}`}>
										{filewatch[0].name}
									</p>
								) : (
									<p className="ml-[1.2rem] mr-[6%]">
										No file selected
									</p>
								)}
								{errors.picture && (
									<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mt-[0.4rem] mb-[0.8rem]">
										{errors.picture.message}
									</span>
								)}
								<div className="flex w-[45vw] justify-around items-center mt-[0.8rem] mb-[0.4rem]">
									{pictureUpdated && (
										<FontAwesomeIcon
											icon={faCheckDouble}
											size={"xl"}
											style={{ color: "#84CC16" }}
										/>
									)}
								</div>
							</form>
							<button
								type="button"
								title="reset picture to default"
								aria-disabled={isBtnPicDisabled}
								onClick={(e) => {
									isBtnPicDisabled
										? e.preventDefault()
										: restoreDefault();
								}}
								onAnimationEnd={() =>
									setDefaultPicEffect(false)
								}
								className={`relative rounded-md self-end mr-[20%] w-[2.9rem] h-[3.2rem] ${
									defaultPicEffect && "animate-btnFlat"
								} ${
									isBtnPicDisabled
										? "opacity-40 cursor-not-allowed"
										: "hover:opacity-70 transition-all duration-300 ease-in-out hover:translate-y-[5px]"
								}`}>
								<FontAwesomeIcon
									icon={faImagePortrait}
									className="text-appstone dark:text-appmauvedark absolute left-[5px] top-[5px] text-[2.5rem]"
								/>
								<FontAwesomeIcon
									icon={faArrowRotateLeft}
									size="lg"
									style={{ color: "#FF7900" }}
									className="absolute left-[1.6rem] top-[0rem]"
								/>
							</button>
						</div>
						<div className="flex justify-center">
							<button
								title="reset fields"
								type="button"
								onClick={() => {
									setResetBtnEffect(true);
									reset();
									setErrMsg("");
									setErrMsgDel("");
								}}
								onAnimationEnd={() => setResetBtnEffect(false)}
								className={`bg-[#FF7900] text-appblck w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] mob88:text-[0.8rem] rounded-xl mt-[1.2rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px]
                    hover:shadow-btnorange bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] shadow-neatcard ${
						resetBtnEffect && "animate-bgSize"
					}`}>
								<FontAwesomeIcon icon={faEraser} size="2xl" />
							</button>
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
					</motion.section>

					{/* account suppression */}
					{session?.user.role === "user" ? (
						<motion.div
							animate={{ opacity: [0, 1], y: [50, 0] }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className="flex flex-col text-clamp5 mob88:text-clamp1 items-center justify-center mt-[3.2rem] mb-[3.2rem]">
							<hr className="w-[80%] text-center mb-[3.2rem] border-t-solid border-t-[4px] rounded-md border-t-gray-300 dark:border-t-gray-500"></hr>
							<h3 className="text-clamp3 mob48:text-clamp5 text-center mb-[2rem] font-semibold">
								DELETE USER ACCOUNT
							</h3>
							<p className="text-center mx-[1.8rem] mb-[1.2rem]">
								You can permanently deactivate your account.
							</p>
							<p className="uppercase font-medium text-red-600 dark:text-appred drop-shadow-light text-balance mx-[1.6rem]">
								This cannot be undone!
							</p>
							<button
								onClick={() => handleDelete()}
								onAnimationEnd={() => setDeleteEffect(false)}
								className={`border-none bg-appred text-white hover:bg-red-700 hover:shadow-btndred uppercase my-[2.4rem] w-[20.8rem] h-[3.2rem] sm:w-fit sm:h-fit sm:p-[0.5rem] rounded-2xl transition-all ease hover:translate-y-[5px] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] shadow-neatcard ${
									deleteEffect && "animate-bgSize"
								}`}>
								Delete account
							</button>
							<AnimatePresence>
								{errMsgDel && (
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
										{errMsgDel}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>
					) : (
						<div></div>
					)}
				</div>
			)}
		</>
	);
}

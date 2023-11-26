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
	const [errMsg, setErrMsg] = useState("");
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

	useEffect(() => {
		if (errors?.username) {
			setFocus("username");
		} else if (errors?.email) {
			setFocus("email");
		} else if (errors?.password) {
			setFocus("password");
		}
	});

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
			document.getElementById("body-container").style.overflow = "hidden";
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

	const handleClose = () => {
		setCloseUserPostsEffect(true);
		setTimeout(() => {
			setIsBlurred(false);
		}, 390);
		setTimeout(() => {
			setIsPostsShown(false);
			document.getElementById("body-container").style.overflow = "";
		}, 400);
	};

	const goToPost = () => {
		setGoToPostEffect(true);
		setTimeout(() => {
			setIsBlurred(false);
		}, 490);
		setTimeout(() => {
			setIsPostsShown(false);
			document.getElementById("body-container").style.overflow = "";
		}, 500);
	};

	const submitUpdate = async (data) => {
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setErrMsg();
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
				const resp = await axiosAuth.get(`/auth/user/${user.id}`);
				const userInfo = resp.data;
				setUserDetail(userInfo);
			});
		} catch (err) {
			if (!err?.response) {
				setErrMsg(
					"Server unresponsive, please try again or come back later."
				);
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			} else if (err.response?.status === 409) {
				setError("username", {
					type: "custom",
					message: "Username already taken",
				});
				setFocus("username");
			} else if (err.response?.status === 403) {
				setError("email", {
					type: "custom",
					message: "Email already taken",
				});
				setFocus("email");
			} else {
				setErrMsg("Update failed, please try again.");
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	const submitPicUpdate = async (data) => {
		if (data.picture <= 0) {
			return;
		}
		const form = new FormData();
		form.append("picture", data.picture[0]);
		console.log("file upload? : ", form);
		const headers = {
			"Content-Type": "multipart/form-data",
		};
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setErrMsg();
		try {
			await axiosAuth({
				method: "post",
				url: `/auth/user/${user.id}/upload`,
				data: form,
				headers: headers,
			}).then(async (response) => {
				if (response) {
					//console.log("response data: ", response?.data);
					//console.log("updated");
					const resp = await axiosAuth.get(`/auth/user/${user.id}`);
					setUserDetail(resp.data);
					setPictureUpdated(true);
				}
			});
		} catch (err) {
			if (!err?.response) {
				setErrMsg(
					"Server unresponsive, please try again or come back later."
				);
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
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
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	const handleDelete = async () => {
		setPasswordUpdated(false);
		setPictureUpdated(false);
		setDeleteEffect(true);
		setErrMsg();
		setTimeout(async () => {
			try {
				let answer = window.confirm(
					"LAST CONFIRMATION : Are you sure you want to delete your account?"
				);
				if (answer) {
					await axiosAuth({
						method: "delete",
						url: `/auth/user/${user.id}`,
					}).then(() => {
						console.log("account removed !");
						logout();
						signOut({ callbackUrl: "/" });
					});
				}
			} catch (err) {
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				} else {
					setErrMsg("Account removal failed, please try again.");
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}
		}, 600);
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

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
						console.log("response data: ", response.data);
						console.log("updated and restored default pic");
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
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				} else {
					setErrMsg("Update failed, please try again.");
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}
		}, 700);
	};

	if (!isBrowser()) return;
	window.addEventListener("scroll", () => {
		document.documentElement.style.setProperty(
			"--scroll-y",
			`${window.scrollY}px`
		);
	});

	return (
		<div className="flex flex-col mb-[2.4rem]">
			{/* profile info */}
			<h1 className="text-clamp3 text-center pt-[3.2rem] mb-[2rem] uppercase font-semibold">
				My Profile
			</h1>
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
			<section className="flex flex-col text-clamp8 items-center mb-[3.2rem]">
				<p>{userDetail.username}</p>
				<p>{userDetail.email}</p>
				{userDetail.motto == "" || userDetail.motto == null ? (
					<p>no motto</p>
				) : (
					<p className="mx-[0.8rem]">{`"${userDetail.motto}"`}</p>
				)}
				<FollowersFollowing user={user} />
				<button
					onClick={() => showUsrPicZoomOverlay()}
					className="w-[12.8rem] h-[12.8rem] rounded-full cursor-pointer touch-auto transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light">
					<Image
						width={0}
						height={0}
						priority={true}
						src={userDetail.picture}
						alt={`${userDetail.username} picture`}
						placeholder="empty"
						className="rounded-full w-full h-full border-2"
					/>
				</button>
				<div
					className={
						bgZoomed
							? "fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] flex"
							: "hidden"
					}
					onClick={() => hideUsrPicZoomOverlay()}>
					{bgZoomed && (
						<Image
							width={0}
							height={0}
							priority={true}
							src={userDetail.picture}
							placeholder="empty"
							alt={`${userDetail.username} picture`}
							className="block m-auto w-[96%] aspect-square object-cover rounded-full border-2 animate-resizeZoom"
						/>
					)}
				</div>
			</section>

			{/* logged user posts */}
			<div
				ref={scope}
				className="flex justify-center mt-[1.2rem] mb-[2.5rem]">
				<button
					onClick={() => showPosts()}
					className="border-2 border-appmauvedark text-appmauvedark text-clamp7 uppercase font-medium bg-apppastgreen rounded-full px-[0.8rem] py-[0.4rem] hover:bg-indigo-100">
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
						aria-live="assertive">
						{postsErrMsg}
					</motion.p>
				)}
			</AnimatePresence>

			{/* user posts shown */}
			<AnimatePresence>
				{isPostsShown && (
					<motion.section
						key="user-posts-card"
						initial={{ opacity: 0, y: 100, x: 100 }}
						animate={{ opacity: 1, y: 0, x: 0 }}
						exit={{ opacity: 0, y: 100, x: 100 }}
						transition={{ duration: 0.4, origin: 1, delay: 0.25 }}
						className={`z-[700] w-full top-0 left-0 h-full fixed overflow-auto ${
							isBlurred && "animate-pop"
						}`}>
						<div className="bg-apppinklight absolute top-[9.6rem] left-[4.5%] p-3 w-[90%] min-h-[18rem] rounded-xl shadow-neatcard overflow-auto">
							<div className="flex justify-end">
								<FontAwesomeIcon
									icon={faXmark}
									size="2xl"
									onClick={() => handleClose()}
									onAnimationEnd={() =>
										setCloseUserPostsEffect(false)
									}
									className={`cursor-pointer hover:text-appred mb-[1.2rem] ${
										closeUserPostsEffect &&
										"animate-pressed opacity-60"
									}`}
								/>
							</div>

							<AnimatePresence>
								{userPosts.length > 0 ? (
									<motion.section
										key="user-posts-list"
										layout
										initial={{ opacity: 0, x: -80 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{
											opacity: 0,
											x: -80,
											transition: {
												ease: "easeOut",
												duration: 0.4,
											},
										}}
										transition={{
											type: "spring",
											delay: 0.7,
										}}
										className="">
										{userPosts &&
											userPosts.map((post, index) => (
												<div
													key={post.id}
													onClick={() => {
														setClickedBtn(index);
														goToPost();
													}}
													className={`cursor-pointer border-2 border-white rounded-2xl bg-white my-[0.8rem] text-clamp1 px-[1.4rem] py-[0.8rem] ${
														clickedBtn === index &&
														goToPostEffect &&
														"border-violet-500 bg-violet-200"
													}`}
													onAnimationEnd={() =>
														setGoToPostEffect(false)
													}>
													<a
														href={`/coms/${[
															post.id,
														]}`}>
														{post.title && (
															<p className="text-clamp5 font-medium text-center mb-[0.4rem]">
																{post.title}
															</p>
														)}
														<p className="line-clamp-1 mb-[0.4rem]">
															{post.content}
														</p>
														<div className="flex justify-evenly">
															<p className="text-green-500 drop-shadow-lighter">
																{post.likes}
															</p>
															<p className="text-red-500 drop-shadow-lighter">
																{post.dislikes}
															</p>
															<p className="text-appturq drop-shadow-lighter">
																{
																	post.discussions
																}
															</p>
														</div>
													</a>
												</div>
											))}
									</motion.section>
								) : (
									<div></div>
								)}
							</AnimatePresence>
						</div>
					</motion.section>
				)}
			</AnimatePresence>

			{/* update forms */}
			<motion.section
				animate={{ opacity: [0, 1], y: [50, 0] }}
				transition={{ duration: 0.6, delay: 0.3 }}>
				<div className="flex flex-col items-center">
					<hr className="w-[80vw] text-center mb-[3.2rem] border-t-solid border-t-[4px] rounded-md border-t-gray-300"></hr>
					<h2 className="text-clamp3 text-center mb-[2rem] uppercase font-semibold">
						Update Profile Details
					</h2>
				</div>
				<div className="flex flex-col items-center">
					<form
						className="mb-[0.4rem] py-[0.4rem] flex items-center justify-evenly text-clamp6 w-[80%]"
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
							className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${
								errors.username
									? "border-appred focus:border-appred"
									: ""
							}`}
						/>
						<button
							title="confirm username update"
							type="submit"
							disabled={!usrN}
							onClick={() => setUsrnEffect(true)}
							onAnimationEnd={() => setUsrnEffect(false)}
							className={`bg-appstone text-white w-fit rounded-2xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 py-[0.4rem] px-[1rem] ${
								usrnEffect && "animate-bgSize"
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
						className="mb-[0.4rem] py-[0.4rem] flex items-center justify-evenly text-clamp6 w-[80%]"
						onSubmit={handleSubmit(submitUpdate)}>
						<input
							type="email"
							placeholder={`  ${userDetail.email}`}
							{...register("email", {
								pattern: {
									value: EMAIL_REGEX,
									message: "Email must have a valid format",
								},
							})}
							className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${
								errors.email
									? "border-appred focus:border-appred"
									: ""
							}`}
						/>
						<button
							title="confirm email update"
							type="submit"
							disabled={!eml}
							onClick={() => setEmailEffect(true)}
							onAnimationEnd={() => setEmailEffect(false)}
							className={`bg-appstone text-white w-fit rounded-2xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 py-[0.4rem] px-[1rem] ${
								emailEffect && "animate-bgSize"
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
						<div className="flex items-center justify-evenly w-[80%]">
							<input
								type="password"
								autoComplete="off"
								placeholder="  Current Password"
								{...register("currpsw", {
									// required: 'This field is required'
								})}
								className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${
									errors.currpsw
										? "border-appred focus:border-appred"
										: ""
								}`}
							/>
							<button
								type="button"
								className={`bg-appstone text-white w-fit rounded-2xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 py-[0.4rem] px-[1rem] opacity-0`}>
								<FontAwesomeIcon icon={faPenFancy} />
							</button>
						</div>
						<div className="flex items-center justify-evenly w-[80%]">
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
										message: "35 characters maximum",
									},
									pattern: {
										value: PASSWORD_REGEX,
										message:
											"Password must have at least 1 digit and 1 letter",
									},
								})}
								className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${
									errors.password
										? "border-appred focus:border-appred"
										: ""
								}`}
							/>
							<button
								title="confirm password update"
								type="submit"
								disabled={!curpsw || !psw || !confpasw}
								onClick={() => setPwdEffect(true)}
								onAnimationEnd={() => setPwdEffect(false)}
								className={`bg-appstone text-white w-fit rounded-2xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 py-[0.4rem] px-[1rem] ${
									pwdEffect && "animate-bgSize"
								}`}>
								<FontAwesomeIcon icon={faPenFancy} />
							</button>
						</div>
						{errors.password && (
							<span className="text-red-600  bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
								{errors.password.message}
							</span>
						)}
						<div className="flex justify-evenly items-center w-[80%]">
							<input
								type="password"
								autoComplete="off"
								placeholder="  Confirm New Password"
								{...register("confirm_password", {
									validate: (value) =>
										value === password.current ||
										"Passwords do not match",
								})}
								className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${
									errors.confirm_password
										? "border-appred focus:border-appred"
										: ""
								}`}
							/>
							{passwordUpdated ? (
								<FontAwesomeIcon
									icon={faCheckDouble}
									size={"xl"}
									style={{ color: "#84CC16" }}
									className={`my-[0.8rem] py-[0.4rem] px-[0.75rem] ${
										pswUpdatedEffect &&
										"animate-reversePing"
									}`}
									onAnimationEnd={() =>
										setPswUpdatedEffect(false)
									}
								/>
							) : (
								<FontAwesomeIcon
									icon={faCheckDouble}
									size={"xl"}
									style={{ color: "#84CC16" }}
									className="my-[0.8rem] py-[0.4rem] px-[1rem] opacity-0"
								/>
							)}
						</div>
						{errors.confirm_password && (
							<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
								{errors.confirm_password.message}
							</span>
						)}
					</form>
				</div>

				<div className="flex flex-col items-center">
					<form
						className="py-[0.4rem] flex justify-evenly items-center text-clamp6 w-[80%] mb-[0.9rem]"
						onSubmit={handleSubmit(submitUpdate)}>
						<textarea
							type="text"
							placeholder={
								userDetail.motto == "" ||
								userDetail.motto == null
									? "  Type a nice motto here..."
									: `  ${userDetail.motto}`
							}
							{...register("motto")}
							className="border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred h-[9.6rem] resize w-[74%]"
						/>
						<button
							title="confirm motto update"
							type="submit"
							disabled={!mt}
							onClick={() => setMottoEffect(true)}
							onAnimationEnd={() => setMottoEffect(false)}
							className={`bg-appstone text-white w-fit rounded-2xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 py-[0.4rem] px-[1rem] ${
								mottoEffect && "animate-bgSize"
							}`}>
							<FontAwesomeIcon icon={faPenFancy} />
						</button>
					</form>
				</div>

				<div className="flex flex-col items-center">
					<form
						className=" py-[0.4rem] flex flex-col items-center text-clamp6 w-full"
						onSubmit={handleSubmit(submitPicUpdate)}>
						<div className="flex w-[60%] items-center justify-evenly">
							<div
								className={`relative hover:opacity-70 ml-[16%] ${
									fileWiggle && "animate-wiggle"
								}`}
								onAnimationEnd={() => setFileWiggle(false)}>
								<input
									type="file"
									onClick={() => setFileWiggle(true)}
									name="picture"
									placeholder="  Update Profile Picture"
									{...register("picture")}
									className="border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[5.3rem] h-[2.9rem] opacity-0 file:cursor-pointer"
								/>
								<FontAwesomeIcon
									icon={faPhotoFilm}
									size="2xl"
									style={{ color: "#4E5166" }}
									className="absolute left-[0px] top-[0.3rem] -z-20"
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
							</div>
							<button
								title="confirm picture update"
								type="submit"
								disabled={
									filewatch === null || !filewatch?.[0]?.name
								}
								onClick={() => setPicEffect(true)}
								onAnimationEnd={() => setPicEffect(false)}
								className={`bg-appstone text-white w-fit rounded-2xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-apppastgreen hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnpastgreen bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] disabled:opacity-40 py-[0.4rem] px-[1rem] ml-[24%] mr-[14%] ${
									picEffect && "animate-bgSize"
								}`}>
								<FontAwesomeIcon icon={faPenFancy} />
							</button>
						</div>
						{filewatch && filewatch[0] ? (
							<p
								className={`max-w-[32.5rem] mx-[0.8rem] line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
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
						disabled={
							user.picture ===
							"http://localhost:8000/profile/defaultUser.png"
						}
						type="button"
						title="reset picture to default"
						onClick={() => restoreDefault()}
						onAnimationEnd={() => setDefaultPicEffect(false)}
						className={`relative self-end mr-[20%] hover:enabled:opacity-70 transition-all duration-300 ease-in-out hover:enabled:translate-y-[5px] disabled:opacity-40 ${
							defaultPicEffect && "animate-btnFlat"
						}`}>
						<FontAwesomeIcon
							icon={faImagePortrait}
							style={{ color: "#4E5166" }}
							className="absolute left-[0px] top-[0px] text-[2.5rem]"
						/>
						<FontAwesomeIcon
							icon={faArrowRotateLeft}
							size="lg"
							style={{ color: "#FF7900" }}
							className="absolute left-[1.1rem] top-[0rem]"
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
						}}
						onAnimationEnd={() => setResetBtnEffect(false)}
						className={`bg-[#FF7900] text-appblck w-[3.6rem] h-[3.6rem] rounded-xl mt-[1.2rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px]
                    hover:shadow-btnorange bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] ${
						resetBtnEffect && "animate-bgSize"
					}`}>
						<FontAwesomeIcon icon={faEraser} size="2xl" />
					</button>
				</div>
			</motion.section>

			{/* account suppression */}
			{session?.user.role === "user" ? (
				<motion.div
					animate={{ opacity: [0, 1], y: [50, 0] }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="flex flex-col text-clamp5 items-center justify-center mt-[3.2rem] mb-[3.2rem]">
					<hr className="w-[80%] text-center mb-[3.2rem] border-t-solid border-t-[4px] rounded-md border-t-gray-300"></hr>
					<h3 className="text-clamp3 text-center mb-[2rem] font-semibold">
						DELETE USER ACCOUNT
					</h3>
					<p>You can permanently deactivate your account.</p>
					<p className="uppercase font-medium text-red-600 drop-shadow-light">
						{" "}
						This cannot be undone!
					</p>
					<button
						onClick={() => handleDelete()}
						onAnimationEnd={() => setDeleteEffect(false)}
						className={`border-none bg-appred text-white hover:bg-red-700 hover:shadow-btndred uppercase my-[2.4rem] w-[20.8rem] h-[3.2rem] rounded-2xl transition-all ease hover:translate-y-[5px] bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] ${
							deleteEffect && "animate-bgSize"
						}`}>
						Delete account
					</button>
				</motion.div>
			) : (
				<div></div>
			)}
		</div>
	);
}

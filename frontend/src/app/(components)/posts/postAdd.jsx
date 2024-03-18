"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPhotoFilm,
	faMusic,
	faXmark,
	faEraser,
	faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { MdOutlinePostAdd } from "react-icons/md";
import { FocusOn } from "react-focus-on";

// eslint-disable-next-line max-len
const LINK_REGEX = /^https?:\/\//gm;
//or this one to match domains extensions and base urls
// const LINK_REGEX = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/

export default function PostAdd({ setPosts, display }) {
	const axiosAuth = useAxiosAuth();
	const searchParams = useSearchParams();
	const pg = searchParams.get("page") ?? "1";
	const [addPostEffect, setAddPostEffect] = useState(false);
	const [showAddPost, setShowAddPost] = useState(false);
	const [blur, setBlur] = useState(false);
	const [resetBtnEffect, setResetBtnEffect] = useState(false);
	const [sendBtnEffect, setSendBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [isSent, setIsSent] = useState(false);
	const [showTEmojiPicker, setShowTEmojiPicker] = useState(false);
	const [showCEmojiPicker, setShowCEmojiPicker] = useState(false);
	const [emojiTBtnClickEffect, setEmojiTBtnClickEffect] = useState(false);
	const [emojiCBtnClickEffect, setEmojiCBtnClickEffect] = useState(false);
	const [closeAddPostEffect, setCloseAddPostEffect] = useState(false);

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
			title: "",
			content: "",
			fileUrl: "",
			link: "",
		},
		mode: "onSubmit",
	});
	const filewatch = watch("fileUrl");
	const ctt = watch("content");
	const isDisabled = !ctt;

	useEffect(() => {
		if (errors?.content) {
			setFocus("content");
		}
	});

	const submitForm = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
		setIsSent(false);
		let headers;
		if (data.fileUrl <= 0) {
			data = {
				title: getValues("title"),
				content: getValues("content"),
				link: getValues("link"),
			};
			headers = { "Content-Type": "application/json" };
		} else {
			const form = new FormData();
			form.append("fileUrl", data.fileUrl[0]);
			form.append("title", getValues("title"));
			form.append("content", getValues("content"));
			form.append("link", getValues("link"));
			console.log("file upload? : ", form);
			data = form;
			headers = { "Content-Type": "multipart/form-data" };
		}
		const abortSignal = AbortSignal.timeout(4000);
		try {
			await axiosAuth({
				method: "post",
				url: `/posts`,
				data: data,
				headers: headers,
				withCredentials: true,
				signal: abortSignal,
			}).then(async (response) => {
				console.log(response);
				setIsSent(true);
				setShowAddPost(false);
				const resp = await axiosAuth.get(
					`/posts?page=${pg}&per_page=6`
				);
				setPosts(resp.data.content);
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
				setError("fileUrl", {
					type: "custom",
					message: "Max size reached. (8Mb max)",
				});
			} else if (err.response?.status === 403) {
				setError("fileUrl", {
					type: "custom",
					message: "Bad file type. (video, picture or audio only)",
				});
			} else {
				setErrMsg("Post creation failed, please try again.");
			}
		}
	};

	useEffect(() => {
		if (isSubmitSuccessful && isSent) {
			setErrMsg("");
			reset();
		}
	}, [isSubmitSuccessful, isSent, reset]);

	const btnReset = () => {
		setResetBtnEffect(true);
		reset();
	};

	const handleTEmojiPickerHideShow = () => {
		setShowTEmojiPicker(!showTEmojiPicker);
		setShowCEmojiPicker(false);
	};

	const handleCEmojiPickerHideShow = () => {
		setShowCEmojiPicker(!showCEmojiPicker);
		setShowTEmojiPicker(false);
	};

	const handleTEmojiClick = (emoji) => {
		let message = getValues("title");
		message += emoji.emoji;
		setValue("title", message);
	};

	const handleCEmojiClick = (emoji) => {
		let message = getValues("content");
		message += emoji.emoji;
		setValue("content", message);
	};

	const handleShowAddPost = () => {
		setAddPostEffect(true);
		setTimeout(() => {
			setShowAddPost(true);
		}, 400);
		setTimeout(() => {
			setBlur(true);
		}, 1100);
	};

	const handleClose = () => {
		setCloseAddPostEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 390);
		setTimeout(() => {
			setShowAddPost(false);
			setShowTEmojiPicker(false);
			setShowCEmojiPicker(false);
		}, 400);
	};

	const handleShowEmojiT = () => {
		setEmojiTBtnClickEffect(true);
		setTimeout(() => {
			handleTEmojiPickerHideShow();
		}, 400);
	};

	const handleShowEmojiC = () => {
		setEmojiCBtnClickEffect(true);
		setTimeout(() => {
			handleCEmojiPickerHideShow();
		}, 400);
	};

	return (
		<>
			<button
				title="write a post"
				className={`w-[3rem] h-[3rem] mob88:w-[1.8rem] mob88:h-[1.8rem] text-appturq hover:opacity-60 rounded-lg ${
					addPostEffect && "animate-pressed"
				}`}
				onClick={() => handleShowAddPost()}
				onAnimationEnd={() => setAddPostEffect(false)}>
				<MdOutlinePostAdd className="w-[3rem] h-[3rem]" />
			</button>
			<AnimatePresence>
				{showAddPost && (
					<motion.section
						layout
						key="add-post"
						initial={{ opacity: 0, y: -100 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{
							opacity: 0,
							y: -100,
							transition: {
								ease: "easeOut",
								duration: 0.4,
							},
						}}
						transition={{
							type: "spring",
							delay: 0.15,
						}}
						className={`z-[700] fixed top-0 left-0 bg-[rgb(255,255,255,0.01)] w-screen h-full ${
							blur && "animate-pop"
						}`}>
						<div className="z-[5] bg-gray-200 dark:bg-applightdark absolute top-[8rem] mob88:top-[5.6rem] smallLandscape:top-[0.2rem] right-[calc(50vw-(90vw/2))] w-[90vw] lg:right-[calc(50vw-(70vw/2))] lg:w-[70vw] rounded-xl shadow-neatcard">
							<FocusOn
								onClickOutside={() => handleClose()}
								onEscapeKey={() => handleClose()}>
								<div role="dialog" aria-labelledby="add-ttl">
									<div className="flex justify-end mt-[0.5rem] mb-[2.5rem] mr-[0.8rem]">
										<button
											onClick={() => handleClose()}
											className="w-fit"
											aria-label="close add post">
											<FontAwesomeIcon
												icon={faXmark}
												size="2xl"
												onAnimationEnd={() =>
													setCloseAddPostEffect(false)
												}
												className={`cursor-pointer hover:text-appred ${
													closeAddPostEffect &&
													"animate-pressed opacity-60"
												}`}
											/>
										</button>
									</div>

									{/* <div>preview?</div> */}
									<h1
										id="add-ttl"
										className="uppercase text-clamp5 mob88:text-clamp1 text-center font-semibold">
										Add a Post
									</h1>
									<div className="flex flex-col w-full">
										<form
											className="mt-[3rem] mb-[0.4rem] pb-[2rem] flex flex-col items-center text-clamp6 w-full gap-[2rem]"
											onSubmit={handleSubmit(submitForm)}>
											<div className="flex gap-[1rem]">
												<input
													type="text"
													placeholder="A title..."
													{...register("title")}
													className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] lg:w-[50vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${
														errors.title
															? "border-appred focus:border-appred"
															: ""
													}`}
												/>
												{/* title emoji */}
												<div className="flex items-center">
													<div className="">
														<BsEmojiSmileFill
															tabIndex={0}
															title={
																showTEmojiPicker
																	? "hide title emoji picker"
																	: "show title emoji picker"
															}
															className={`text-[2.3rem] mob88:text-[1.8rem] text-yellow-300 bg-black rounded-full cursor-pointer drop-shadow-linkTxt ${
																emojiTBtnClickEffect &&
																"animate-pressed"
															}`}
															onClick={() =>
																handleShowEmojiT()
															}
															onKeyUp={(e) => {
																if (
																	e.key ===
																	"Enter"
																)
																	handleShowEmojiT();
															}}
															onAnimationEnd={() =>
																setEmojiTBtnClickEffect(
																	false
																)
															}
														/>
													</div>
												</div>
											</div>
											{errors.title && (
												<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
													{errors.title.message}
												</span>
											)}
											<div className="flex justify-center gap-[1rem] w-full">
												<textarea
													type="text"
													placeholder="Your message..."
													{...register("content", {
														required:
															"This field is required",
													})}
													className={`border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[70%] min-w-[11rem] h-[5.6rem] min-h-[2.6rem] resize max-w-[80%] max-h-[13.9rem] mob88:max-h-[11.6rem] smallLandscape:max-h-[10.5rem] lg:max-w-[90%] ${
														errors.content
															? "border-appred focus:border-appred"
															: ""
													}`}
												/>
												{/* content emoji */}
												<div className="flex items-center">
													<div className="">
														<BsEmojiSmileFill
															tabIndex={0}
															title={
																showCEmojiPicker
																	? "hide content emoji picker"
																	: "show content emoji picker"
															}
															className={`text-[2.3rem] mob88:text-[1.8rem] text-yellow-300 bg-black rounded-full cursor-pointer drop-shadow-linkTxt ${
																emojiCBtnClickEffect &&
																"animate-pressed"
															}`}
															onClick={() =>
																handleShowEmojiC()
															}
															onKeyUp={(e) => {
																if (
																	e.key ===
																	"Enter"
																)
																	handleShowEmojiC();
															}}
															onAnimationEnd={() =>
																setEmojiCBtnClickEffect(
																	false
																)
															}
														/>
													</div>
												</div>
											</div>
											{errors.content && (
												<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
													{errors.content.message}
												</span>
											)}
											{/* emoji pickers */}
											{showTEmojiPicker && (
												<div className="">
													<Picker
														onEmojiClick={
															handleTEmojiClick
														}
														className="bg-appmauvedark"
													/>
												</div>
											)}
											{showCEmojiPicker && (
												<div className="">
													<Picker
														onEmojiClick={
															handleCEmojiClick
														}
														className="bg-appmauvedark"
													/>
												</div>
											)}

											<button
												type="button"
												title="select file"
												className={`relative my-[0.4rem] w-[5.7rem] h-[4rem] mob88:w-[4rem] mob88:h-[3rem] rounded-xl cursor-pointer hover:opacity-70 ${
													fileWiggle &&
													"animate-wiggle"
												}`}
												onClick={() => {
													setFileWiggle(true);
													document
														.getElementById(
															"fileUrl"
														)
														.click();
												}}
												onAnimationEnd={() =>
													setFileWiggle(false)
												}>
												<input
													id="fileUrl"
													type="file"
													name="fileUrl"
													placeholder="A video, image, or audio file..."
													{...register("fileUrl")}
													className="hidden"
												/>
												<FontAwesomeIcon
													icon={faPhotoFilm}
													size="2xl"
													className="mob88:max-w-[2.8rem] mob88:max-h-[2.8rem] text-appstone dark:text-appmauvedark absolute left-[0rem] top-[0.3rem]"
												/>
												<FontAwesomeIcon
													icon={faMusic}
													size="2xl"
													style={
														errors.fileUrl
															? {
																	color: "#FD2D01",
															  }
															: {
																	color: "#b1ae99",
															  }
													}
													className="absolute left-[1.8rem] mob88:left-[1.3rem] top-[0.3rem] mob88:max-w-[2.6rem] mob88:max-h-[2.6rem]"
												/>
											</button>
											{filewatch && filewatch[0] ? (
												<p
													className={`max-w-[90%] mx-[0.8rem] text-ellipsis overflow-hidden 
                                ${
									errors.fileUrl
										? "text-red-600 underline underline-offset-2 font-semibold"
										: ""
								}`}>
													{filewatch[0].name}
												</p>
											) : (
												<p className="mx-[1.2rem]">
													No file selected
												</p>
											)}
											{errors.fileUrl && (
												<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mt-[0.4rem] mb-[0.8rem]">
													{errors.fileUrl.message}
												</span>
											)}
											<input
												type="text"
												placeholder="A link..."
												{...register("link", {
													pattern: {
														value: LINK_REGEX,
														message:
															"Enter a valid link url",
													},
												})}
												className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] lg:w-[50%] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${
													errors.link
														? "border-appred focus:border-appred"
														: ""
												}`}
											/>
											{errors.link && (
												<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
													{errors.link.message}
												</span>
											)}
											<div className="flex w-full justify-around">
												<button
													type="button"
													title="reset"
													onClick={() => btnReset()}
													onAnimationEnd={() =>
														setResetBtnEffect(false)
													}
													className={`bg-[#FF7900] text-appblck w-[3.5rem] h-[3.5rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
														resetBtnEffect &&
														"animate-pressDown"
													}`}>
													<FontAwesomeIcon
														icon={faEraser}
														size="lg"
													/>
												</button>
												<button
													type="submit"
													title="send a new post"
													aria-disabled={isDisabled}
													onClick={(e) => {
														isDisabled
															? e.preventDefault()
															: setSendBtnEffect(
																	true
															  );
													}}
													onAnimationEnd={() =>
														setSendBtnEffect(false)
													}
													className={`bg-appstone dark:bg-appmauvedark text-white w-[3.5rem] h-[3.5rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mt-[0.8rem] mb-[0.8rem] shadow-neatcard ${
														sendBtnEffect &&
														"animate-pressDown"
													} ${
														isDisabled
															? "opacity-50 cursor-not-allowed"
															: "transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue"
													}`}>
													<FontAwesomeIcon
														icon={faCirclePlus}
														size="lg"
													/>
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
														className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit mob00:mx-auto mob00:w-[90%] px-[0.8rem] text-clamp6 my-[1.2rem]"
														role="alert"
														aria-live="assertive">
														{errMsg}
													</motion.p>
												)}
											</AnimatePresence>
										</form>
									</div>
								</div>
							</FocusOn>
						</div>
					</motion.section>
				)}
			</AnimatePresence>
		</>
	);
}

"use client";
import React, { useState, useEffect, useContext } from "react";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faEraser,
	faXmark,
	faPhotoFilm,
	faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../ChatContext";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function CommentAdd({
	post,
	setPost,
	setAllComms,
	setAddComm,
	session,
}) {
	const axiosAuth = useAxiosAuth();
	const [addCommentBtnEffect, setAddCommentBtnEffect] = useState(false);
	const [resetCommentBtnEffect, setResetCommentBtnEffect] = useState(false);
	const [backCommentBtnEffect, setBackCommentBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [emojiBtnClickEffect, setEmojiBtnClickEffect] = useState(false);

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
			message: "",
			image: "",
		},
		mode: "onSubmit",
	});
	const msg = watch("message");
	const imgwatch = watch("image");
	const { socket } = useContext(ChatContext);
	const isDisabled = !msg;

	const refreshPost = async () => {
		const resp = await axiosAuth.get(`/posts/${post.id}`);
		setPost(resp.data);
		return resp.data;
	};

	useEffect(() => {
		if (!msg) {
			setFocus("message");
		}
	}, [msg, setFocus]);

	const submitAddComment = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
		setIsSent(false);
		let headers;
		const msg = getValues("message");
		if (data.image <= 0) {
			data = {
				message: getValues("message"),
			};
			headers = { "Content-Type": "application/json" };
		} else {
			const form = new FormData();
			form.append("image", data.image[0]);
			form.append("message", getValues("message"));
			data = form;
			headers = { "Content-Type": "multipart/form-data" };
		}
		setTimeout(async () => {
			const abortSignal = AbortSignal.timeout(4000);
			try {
				await axiosAuth({
					method: "post",
					url: `/posts/${post.id}/comment`,
					data: data,
					headers: headers,
					signal: abortSignal,
				}).then(async (response) => {
					//console.log("new comment response", response);
					await refreshPost();
					setIsSent(true);
					const resp = await axiosAuth.get(
						`/posts/${post.id}/comments`
					);
					const res = await axiosAuth.get(`/posts/${post.id}`);
					setAllComms(resp.data);
					setAddComm(false);
					setPost(res.data);
					const findCommId = resp.data.find((comm) => {
						return comm.message === msg;
					});
					socket.current.emit("comment-post", {
						post_id: post.id,
						comment_id: findCommId.id,
						sender_id: session?.user?.user_id,
						user_id: post.user_id,
					});
				});
			} catch (err) {
				console.log("error new comment", err);
				if (err.code === "ERR_CANCELED" && abortSignal.aborted) {
					setErrMsg(
						"Request timed out, please try again or chose another file."
					);
				} else if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				} else if (err.response?.status === 409) {
					setError("image", {
						type: "custom",
						message: "Max size reached. (8Mb max)",
					});
				} else if (err.response?.status === 403) {
					setError("image", {
						type: "custom",
						message: "Bad file type. (picture only)",
					});
				} else {
					setErrMsg("Comment creation failed, please try again.");
					await refreshPost();
				}
			}
		}, 500);
	};

	const resetCommentBtn = async () => {
		setResetCommentBtnEffect(true);
		setErrMsg("");
		reset();
	};

	const commentbackBtn = () => {
		setBackCommentBtnEffect(true);
		setErrMsg("");
		setTimeout(async () => {
			await refreshPost();
			setAddComm(false);
		}, 500);
	};

	useEffect(() => {
		if (isSubmitSuccessful && isSent) {
			setErrMsg("");
			reset();
		}
	}, [isSubmitSuccessful, isSent, reset]);

	const handleEmojiPickerHideShow = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	const handleEmojiClick = (emoji) => {
		let message = getValues("message");
		message += emoji.emoji;
		setValue("message", message);
	};

	const handleShowEmoji = () => {
		setEmojiBtnClickEffect(true);
		setTimeout(() => {
			handleEmojiPickerHideShow();
		}, 400);
	};

	return (
		<motion.section
			initial={{ x: 100, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: 100, opacity: 0 }}
			transition={{ type: "popLayout" }}
			className="">
			<form
				className="flex flex-col mx-auto w-[96%] h-auto z-[999] items-center text-clamp6 mt-[2.4rem] mb-[1.2rem] gap-[0.5rem]"
				onSubmit={handleSubmit(submitAddComment)}>
				<textarea
					type="text"
					placeholder="Your message..."
					{...register("message", {
						required: "This field is required",
					})}
					className={`border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[80%] max-w-[98%] h-[5.6rem] max-h-[20rem] resize mt-0 mb-[0.8rem] min-w-[11rem] min-h-[2.6rem] ${
						errors.message
							? "border-appred focus:border-appred"
							: ""
					}`}
				/>
				{errors.message && (
					<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mb-[2rem]">
						{errors.message.message}
					</span>
				)}
				{/* emoji picker */}
				{showEmojiPicker && (
					<div className="">
						<Picker
							onEmojiClick={handleEmojiClick}
							className="bg-appmauvedark"
						/>
					</div>
				)}

				<button
					type="button"
					title="select image"
					className={`relative rounded-xl my-[0.4rem] w-[4.5rem] h-[2.9rem] hover:opacity-70 ${
						fileWiggle && "animate-wiggle"
					}`}
					onClick={() => {
						setFileWiggle(true);
						document.getElementById("image").click();
					}}
					onAnimationEnd={() => setFileWiggle(false)}>
					<input
						id="image"
						type="file"
						name="image"
						placeholder="A video, image, or audio file..."
						{...register("image")}
						className="hidden"
					/>
					<FontAwesomeIcon
						icon={faPhotoFilm}
						size="xl"
						className="text-appstone dark:text-appmauvedark absolute left-[0px] top-[0.3rem]"
					/>
					<FontAwesomeIcon
						icon={faMusic}
						size="xl"
						style={
							errors.fileUrl
								? { color: "#FD2D01" }
								: { color: "#b1ae99" }
						}
						className="absolute left-[1.8rem] top-[0.3rem]"
					/>
				</button>
				{imgwatch?.[0]?.name ? (
					<p
						className={`max-w-[90%] mx-[0.8rem] text-ellipsis overflow-hidden 
                                ${
									errors.image
										? "text-red-600 underline underline-offset-2 font-semibold"
										: ""
								}`}>
						{imgwatch[0].name}
					</p>
				) : (
					<p className="mx-[1.2rem]">No file selected</p>
				)}
				{errors.image && (
					<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mt-[0.4rem] mb-[0.8rem]">
						{errors.image.message}
					</span>
				)}
				<div className="flex w-full justify-around">
					<div className="flex w-[30%] justify-evenly">
						<button
							title="cancel comment creation"
							type="button"
							onClick={() => commentbackBtn()}
							onAnimationEnd={() =>
								setBackCommentBtnEffect(false)
							}
							className={`h-[3.6rem] w-[3.6rem] mob88:h-[2.8rem] mob88:w-[2.8rem] bg-appred text-appblck rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-opacity-60 dark:hover:text-white hover:translate-y-[5px] hover:shadow-btnlred shadow-neatcard ${
								backCommentBtnEffect &&
								"animate-pressDown bg-apppastgreen"
							}`}>
							<FontAwesomeIcon icon={faXmark} />
						</button>
						<button
							title="reset"
							type="button"
							onClick={() => resetCommentBtn()}
							onAnimationEnd={() =>
								setResetCommentBtnEffect(false)
							}
							className={`h-[3.6rem] w-[3.6rem] mob88:h-[2.8rem] mob88:w-[2.8rem] bg-[#FF7900] text-appblck rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[5px] hover:shadow-btnorange shadow-neatcard ${
								resetCommentBtnEffect &&
								"animate-pressDown bg-apppastgreen"
							}`}>
							<FontAwesomeIcon icon={faEraser} />
						</button>
					</div>
					<div className="flex justify-evenly w-[30%] items-center">
						<div className="relative">
							<BsEmojiSmileFill
								tabIndex={0}
								title={
									showEmojiPicker
										? "hide emoji picker"
										: "show emoji picker"
								}
								className={`text-[2.3rem] mob88:text-[2rem] text-yellow-300 bg-black rounded-full cursor-pointer drop-shadow-linkTxt ${
									emojiBtnClickEffect && "animate-pressed"
								}`}
								onClick={() => handleShowEmoji()}
								onKeyUp={(e) => {
									if (e.key === "Enter") handleShowEmoji();
								}}
								onAnimationEnd={() =>
									setEmojiBtnClickEffect(false)
								}
							/>
						</div>
						<button
							title="send new comment"
							type="submit"
							aria-disabled={isDisabled}
							onClick={(e) => {
								isDisabled
									? e.preventDefault()
									: setAddCommentBtnEffect(true);
							}}
							onAnimationEnd={() => setAddCommentBtnEffect(false)}
							className={`h-[3.6rem] w-[3.6rem] mob88:h-[2.8rem] mob88:w-[2.8rem] bg-appstone dark:bg-appmauvedark text-white rounded-xl mt-[0.8rem] mb-[0.8rem] shadow-neatcard ${
								addCommentBtnEffect &&
								"animate-pressDown bg-apppastgreen"
							} ${
								isDisabled
									? "opacity-50 cursor-not-allowed"
									: "transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[5px] hover:shadow-btnblue"
							}`}>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					</div>
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
							className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit max-[300px]:mx-0 max-[300px]:w-[90%] px-[0.8rem] text-clamp6 my-[1.2rem]"
							role="alert"
							aria-live="assertive">
							{errMsg}
						</motion.p>
					)}
				</AnimatePresence>
			</form>
		</motion.section>
	);
}

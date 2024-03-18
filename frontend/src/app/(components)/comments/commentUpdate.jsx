"use client";
import React, { useState, useEffect } from "react";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEraser,
	faCheck,
	faPhotoFilm,
	faMusic,
	faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function CommentUpdate({
	comment,
	post,
	setupdcomcard,
	setcomments,
}) {
	const axiosAuth = useAxiosAuth();
	const [updCommentBtnEffect, setUpdCommentBtnEffect] = useState(false);
	const [resetCommentUpdBtnEffect, setResetCommentUpdBtnEffect] =
		useState(false);
	const [fileUpdWiggle, setFileUpdWiggle] = useState(false);
	const [fileDeleteEffect, setFileDeleteEffect] = useState(false);
	const [commentImg, setCommentImg] = useState();
	const [updatedComment, setUpdatedComment] = useState(comment);
	const [errMsg, setErrMsg] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [emojiBtnClickEffect, setEmojiBtnClickEffect] = useState(false);

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			message: comment.message,
			image: comment.image,
		},
		mode: "onSubmit",
	});
	const msg = watch("message");
	const imgupdwatch = watch("image");
	const isDisabled = msg == comment.message && !imgupdwatch?.[0]?.name;

	const handleUpdateComment = (data, e) => {
		e.preventDefault();
		setErrMsg("");
		let headers;
		if (data.image <= 0) {
			data = { message: getValues("message") };
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
					method: "put",
					url: `/posts/${post.id}/comment/${comment.id}`,
					data: data,
					headers: headers,
					signal: abortSignal,
				}).then(async (resp) => {
					if (resp) {
						const response = await axiosAuth.get(
							`/posts/${post.id}/comments`
						);
						setcomments(response.data);
						const res = await axiosAuth.get(
							`/posts/${post.id}/comment/${comment.id}`
						);
						reset({ message: res.data.message });
						setupdcomcard(false);
					}
				});
			} catch (err) {
				console.log("error comment upd", err);

				if (err.code === "ERR_CANCELED" && abortSignal.aborted) {
					setErrMsg(
						"Request timed out, please try again or chose another file."
					);
				} else if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				} else if (err.response?.status === 404) {
					setErrMsg("Comment not found, refresh and try again.");
				} else {
					setErrMsg("Updating failed, please try again.");
				}
			}
		}, 500);
	};

	useEffect(() => {
		const handleFile = () => {
			if (comment?.image) {
				setCommentImg(
					comment.image.split("http://localhost:8000/image/")[1]
				);
			}
		};
		handleFile();
	}, [comment.image, imgupdwatch]);

	const handleFileDelete = () => {
		setFileDeleteEffect(true);
		const data = { image: "" };
		setTimeout(async () => {
			try {
				let answer = window.confirm(
					"Are you sure you want to delete this image from your comment?"
				);
				if (answer) {
					await axiosAuth({
						method: "put",
						url: `/posts/${post.id}/comment/${comment.id}`,
						data: data,
					}).then(async (response) => {
						if (response) {
							console.log("image removed", response);
							const res = await axiosAuth.get(
								`/posts/${post.id}/comments`
							);
							setcomments(res.data);
							const resp = await axiosAuth.get(
								`/posts/${post.id}/comment/${comment.id}`
							);
							setUpdatedComment(resp.data);
						}
					});
				}
			} catch (err) {
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				} else {
					setErrMsg("Image removal failed, please try again.");
				}
			}
		}, 600);
	};

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
			exit={{ x: -100, opacity: 0 }}
			transition={{ type: "popLayout" }}
			className="border-2 rounded-xl my-[1.2rem] bg-appsand dark:bg-appstone dark:border-applightdark shadow-neatcard z-[997]">
			<form
				className="flex flex-col mx-auto w-[96%] h-auto items-center text-clamp6 mt-[2.4rem] mb-[1.2rem]"
				onSubmit={handleSubmit(handleUpdateComment)}>
				<textarea
					type="text"
					placeholder="Your message..."
					{...register("message", {
						required: "This field is required",
					})}
					className={`border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[90%] mob48:w-[80%] max-w-[98%] h-[4.4rem] resize min-w-[11rem] min-h-[2.6rem] mt-0 mb-[1.2rem] max-h-[14rem] ${
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
					<div className="mb-[0.8rem]">
						<Picker
							onEmojiClick={handleEmojiClick}
							className="bg-appmauvedark"
						/>
					</div>
				)}

				<button
					type="button"
					title="select file"
					onClick={() => {
						setFileUpdWiggle(true);
						document.getElementById("imageUpd").click();
					}}
					className={`relative my-[0.4rem] w-[5.1rem] h-[2.9rem] hover:opacity-70 rounded-xl ${
						fileUpdWiggle && "animate-wiggle"
					}`}
					onAnimationEnd={() => setFileUpdWiggle(false)}>
					<input
						id="imageUpd"
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
							errors.image
								? { color: "#FD2D01" }
								: { color: "#b1ae99" }
						}
						className="absolute left-[1.8rem] top-[0.3rem]"
					/>
				</button>

				{imgupdwatch?.[0]?.name && (
					<p
						className={`max-w-[90%] mx-[0.8rem] text-ellipsis overflow-hidden 
                        ${
							errors.image
								? "text-red-600 mt-[0.4rem] mb-[0.8rem] bg-white underline underline-offset-2 font-semibold"
								: "mb-[1.2rem]"
						}`}>
						{imgupdwatch[0].name}
					</p>
				)}
				{!imgupdwatch?.[0]?.name && updatedComment.image && (
					<>
						<p className="mx-[1.2rem] mb-[0.4rem]">
							No file selected
						</p>
						<p className="max-w-[90%] mx-[1.2rem] mb-[1.2rem] text-ellipsis overflow-hidden">
							Comment file: {commentImg}
						</p>{" "}
					</>
				)}
				{!imgupdwatch && !updatedComment?.image ? (
					<p className="mx-[1.2rem] mb-[1.2rem]">No file selected</p>
				) : (
					imgupdwatch &&
					!imgupdwatch?.[0]?.name &&
					!updatedComment.image && (
						<p className="mx-[1.2rem] mb-[1.2rem]">
							No file selected
						</p>
					)
				)}
				{updatedComment.image && (
					<button
						type="button"
						title="delete file"
						onClick={() => handleFileDelete()}
						onAnimationEnd={() => setFileDeleteEffect(false)}
						className={`mb-[1.2rem] hover:opacity-60 ${
							fileDeleteEffect && "animate-reversePing"
						}`}>
						<FontAwesomeIcon
							icon={faFileCircleXmark}
							style={{ color: "#F43F5E" }}
							size="lg"
						/>
					</button>
				)}
				{errors.image && (
					<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mb-[1.6rem]">
						{errors.image.message}
					</span>
				)}

				<div className="flex w-full justify-around">
					<div className="flex w-[50%] justify-evenly items-center">
						<button
							title="reset"
							type="button"
							onClick={() => {
								setResetCommentUpdBtnEffect(true);
								reset();
							}}
							onAnimationEnd={() =>
								setResetCommentUpdBtnEffect(false)
							}
							className={`bg-[#FF7900] text-appblck w-[2.9rem] h-[2.9rem] mob88:h-[2.6rem] mob88:w-[2.6rem] rounded-full mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
								resetCommentUpdBtnEffect &&
								"animate-pressDown bg-apppastgreen"
							}`}>
							<FontAwesomeIcon icon={faEraser} />
						</button>

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
							title="confirm comment update"
							type="submit"
							aria-disabled={isDisabled}
							onClick={(e) => {
								isDisabled
									? e.preventDefault()
									: setUpdCommentBtnEffect(true);
							}}
							onAnimationEnd={() => setUpdCommentBtnEffect(false)}
							className={`bg-appstone dark:bg-appmauvedark text-white w-[2.9rem] h-[2.9rem] mob88:h-[2.6rem] mob88:w-[2.6rem] rounded-full mt-[0.8rem] mb-[0.8rem] shadow-neatcard ${
								updCommentBtnEffect &&
								"animate-pressDown bg-apppastgreen text-appblck"
							} ${
								isDisabled
									? "opacity-50 cursor-not-allowed"
									: "transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[4px] hover:shadow-btnblue"
							}`}>
							<FontAwesomeIcon icon={faCheck} className="" />
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
							className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] mob00:mx-0 mob00:w-[96%] text-clamp6 my-[1.2rem]"
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

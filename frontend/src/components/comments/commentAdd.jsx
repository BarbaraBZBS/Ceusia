"use client";
import React, { useState, useEffect } from "react";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
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

export default function CommentAdd({ post, setPost, setAllComms, setAddComm }) {
	const axiosAuth = useAxiosAuth();
	const [addCommentBtnEffect, setAddCommentBtnEffect] = useState(false);
	const [resetCommentBtnEffect, setResetCommentBtnEffect] = useState(false);
	const [backCommentBtnEffect, setBackCommentBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const {
		register,
		handleSubmit,
		getValues,
		watch,
		setError,
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

	const refreshPost = async () => {
		const resp = await axiosAuth.get(`/posts/${post.id}`);
		setPost(resp.data);
		return resp.data;
	};

	const submitAddComment = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
		let headers;
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
			try {
				await axiosAuth({
					method: "post",
					url: `/posts/${post.id}/comment`,
					data: data,
					headers: headers,
				}).then(async (response) => {
					console.log(response);
					await refreshPost();
					const resp = await axiosAuth.get(
						`/posts/${post.id}/comments`
					);
					setAllComms(resp.data);
					setAddComm(false);
				});
			} catch (err) {
				if (!err?.response) {
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
		if (isSubmitSuccessful) {
			setErrMsg("");
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<motion.section
			initial={{ x: 100, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: 100, opacity: 0 }}
			transition={{ type: "popLayout" }}
			className="">
			<form
				className="flex flex-col mx-auto w-[96%] h-auto z-[999] items-center text-clamp6 mt-[2.4rem] mb-[1.2rem]"
				onSubmit={handleSubmit(submitAddComment)}>
				<textarea
					type="text"
					placeholder="Your message..."
					{...register("message", {
						required: "This field is required",
					})}
					className={`border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[80%] h-[5.6rem] resize mt-0 mb-[0.8rem] ${
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
				<div
					className={`relative hover:opacity-70 ${
						fileWiggle && "animate-wiggle"
					}`}
					onAnimationEnd={() => setFileWiggle(false)}>
					<input
						onClick={() => setFileWiggle(true)}
						type="file"
						name="image"
						placeholder="A video, image, or audio file..."
						{...register("image")}
						className="border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[4.5rem] h-[2.5rem] opacity-0 file:cursor-pointer"
					/>
					<FontAwesomeIcon
						icon={faPhotoFilm}
						size="xl"
						style={{ color: "#4E5166" }}
						className="absolute left-[0px] top-[0.3rem] -z-20"
					/>
					<FontAwesomeIcon
						icon={faMusic}
						size="xl"
						style={
							errors.fileUrl
								? { color: "#FD2D01" }
								: { color: "#b1ae99" }
						}
						className="absolute left-[1.8rem] top-[0.3rem] -z-10"
					/>
				</div>
				{imgwatch?.[0]?.name ? (
					<p
						className={`max-w-[32.5rem] mx-[0.8rem] line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
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
							title="cancel"
							type="button"
							onClick={() => commentbackBtn()}
							onAnimationEnd={() =>
								setBackCommentBtnEffect(false)
							}
							className={`h-[3.6rem] w-[3.6rem] bg-appred text-appblck rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-opacity-60 hover:translate-y-[5px] hover:shadow-btnlred shadow-neatcard ${
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
							className={`h-[3.6rem] w-[3.6rem] bg-[#FF7900] text-appblck rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[5px] hover:shadow-btnorange shadow-neatcard ${
								resetCommentBtnEffect &&
								"animate-pressDown bg-apppastgreen"
							}`}>
							<FontAwesomeIcon icon={faEraser} />
						</button>
					</div>
					<button
						title="send new comment"
						type="submit"
						disabled={!msg}
						onClick={() => setAddCommentBtnEffect(true)}
						onAnimationEnd={() => setAddCommentBtnEffect(false)}
						className={`h-[3.6rem] w-[3.6rem] bg-appstone text-white rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[5px] hover:enabled:shadow-btnblue disabled:opacity-50 shadow-neatcard ${
							addCommentBtnEffect &&
							"animate-pressDown bg-apppastgreen"
						}`}>
						<FontAwesomeIcon icon={faPlus} />
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
							aria-live="assertive">
							{errMsg}
						</motion.p>
					)}
				</AnimatePresence>
			</form>
		</motion.section>
	);
}

"use client";
import React, { useState, useEffect } from "react";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
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
	const [fileWiggle, setFileWiggle] = useState(false);
	const [fileDeleteEffect, setFileDeleteEffect] = useState(false);
	const [commentImg, setCommentImg] = useState();
	const [updatedComment, setUpdatedComment] = useState(comment);
	const [errMsg, setErrMsg] = useState("");
	const {
		register,
		handleSubmit,
		getValues,
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
	const imgwatch = watch("image");

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
			try {
				await axiosAuth({
					method: "put",
					url: `/posts/${post.id}/comment/${comment.id}`,
					data: data,
					headers: headers,
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
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				}
				if (err.response?.status === 404) {
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
	}, [comment.image, imgwatch]);

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

	return (
		<motion.section
			initial={{ x: 100, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -100, opacity: 0 }}
			transition={{ type: "popLayout" }}
			className="border-2 rounded-xl my-[1.2rem] bg-appsand shadow-neatcard z-[997]">
			<form
				className="flex flex-col mx-auto w-[96%] h-auto items-center text-clamp6 mt-[2.4rem] mb-[1.2rem]"
				onSubmit={handleSubmit(handleUpdateComment)}>
				<textarea
					type="text"
					placeholder="Your message..."
					{...register("message", {
						required: "This field is required",
					})}
					className={`border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[90%] max-w-full h-[4.4rem] resize mt-0 mb-[1.2rem] ${
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
						className="border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[5.1rem] h-[2.9rem] mb-[0.4rem] opacity-0 file:cursor-pointer"
					/>
					<FontAwesomeIcon
						icon={faPhotoFilm}
						size="2x"
						style={{ color: "#4E5166" }}
						className="absolute left-[0px] top-[0.3rem] -z-20"
					/>
					<FontAwesomeIcon
						icon={faMusic}
						size="2x"
						style={
							errors.image
								? { color: "#FD2D01" }
								: { color: "#b1ae99" }
						}
						className="absolute left-[1.8rem] top-[0.3rem] -z-10"
					/>
				</div>
				{imgwatch?.[0]?.name && (
					<p
						className={`max-w-[30rem] mx-[0.8rem] line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                        ${
							errors.image
								? "text-red-600 mt-[0.4rem] mb-[0.8rem] bg-white underline underline-offset-2 font-semibold"
								: "mb-[1.2rem]"
						}`}>
						{imgwatch[0].name}
					</p>
				)}
				{!imgwatch?.[0]?.name && updatedComment.image && (
					<>
						<p className="mx-[1.2rem] mb-[0.4rem]">
							No file selected
						</p>
						<p className="max-w-[32.5rem] mx-[1.2rem] mb-[1.2rem] text-ellipsis overflow-hidden">
							Comment file: {commentImg}
						</p>{" "}
					</>
				)}
				{!imgwatch && !updatedComment?.image ? (
					<p className="mx-[1.2rem] mb-[1.2rem]">No file selected</p>
				) : (
					imgwatch &&
					!imgwatch?.[0]?.name &&
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
							className={`bg-[#FF7900] text-appblck w-[2.9rem] h-[2.9rem] rounded-full mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
								resetCommentUpdBtnEffect &&
								"animate-pressDown bg-apppastgreen"
							}`}>
							<FontAwesomeIcon icon={faEraser} />
						</button>
						<button
							title="confirm comment update"
							type="submit"
							disabled={
								msg == comment.message && !imgwatch?.[0]?.name
							}
							onClick={() => setUpdCommentBtnEffect(true)}
							onAnimationEnd={() => setUpdCommentBtnEffect(false)}
							className={`bg-appstone text-white w-[2.9rem] h-[2.9rem] rounded-full mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[4px] hover:enabled:shadow-btnblue disabled:opacity-50 shadow-neatcard ${
								updCommentBtnEffect &&
								"animate-pressDown bg-apppastgreen"
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

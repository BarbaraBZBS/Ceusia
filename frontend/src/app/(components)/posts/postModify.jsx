"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPhotoFilm,
	faEraser,
	faPenFancy,
	faLeftLong,
	faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ModifyPost({ post }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pg = searchParams.get("pg") ?? "1";
	const axiosAuth = useAxiosAuth();
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		setError,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: post.title,
			content: post.content,
			fileUrl: post.fileUrl,
			link: post.link,
		},
		mode: "onSubmit",
	});
	const ttl = watch("title");
	const ctt = watch("content");
	const lnk = watch("link");
	const [postUpdEffect, setPostUpdEffect] = useState(false);
	const [resetUpdEffect, setResetUpdEffect] = useState(false);
	const [backBtnEffect, setBackBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [fileDeleteEffect, setFileDeleteEffect] = useState(false);
	const [updatedPost, setUpdatedPost] = useState(post);
	const [errMsg, setErrMsg] = useState("");
	const [showTEmojiPicker, setShowTEmojiPicker] = useState(false);
	const [showCEmojiPicker, setShowCEmojiPicker] = useState(false);
	const [emojiTBtnClickEffect, setEmojiTBtnClickEffect] = useState(false);
	const [emojiCBtnClickEffect, setEmojiCBtnClickEffect] = useState(false);
	const filewatch = watch("fileUrl");
	//console.log(filewatch);
	const [postFile, setPostFile] = useState();
	const isDisabled =
		ttl == post.title &&
		ctt == post.content &&
		!filewatch?.[0]?.name &&
		lnk == post.link;
	const isBrowser = () => typeof window !== "undefined";

	const submitUpdateForm = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
		let headers;
		if (data.fileUrl <= 0) {
			data = {
				title: getValues("title"),
				content: getValues("content"),
				link: getValues("link"),
			};
			headers = {
				"Content-Type": "application/json",
			};
		} else {
			const form = new FormData();
			form.append("fileUrl", data.fileUrl[0]);
			form.append("title", getValues("title"));
			form.append("content", getValues("content"));
			form.append("link", getValues("link"));
			console.log("file upload? : ", form);
			data = form;
			headers = {
				"Content-Type": "multipart/form-data",
			};
		}
		setTimeout(async () => {
			const abortSignal = AbortSignal.timeout(4000);
			try {
				await axiosAuth({
					method: "put",
					url: `/posts/${post.id}`,
					data: data,
					headers: headers,
					signal: abortSignal,
				}).then(async (response) => {
					if (response) {
						//console.log(response);
						router.push(
							`/thread?page=${pg}&per_page=6#${post.id}`,
							{ scroll: true }
						);
						router.refresh();
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
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				} else if (err.response?.status === 409) {
					setError("fileUrl", {
						type: "custom",
						message: "Max size reached. (8Mb max)",
					});
				} else if (err.response?.status === 403) {
					setError("fileUrl", {
						type: "custom",
						message:
							"Bad file type. (video, picture or audio only)",
					});
				} else {
					setErrMsg("Updating failed, please try again.");
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}
		}, 600);
	};

	useEffect(() => {
		const handleFile = () => {
			if (updatedPost?.fileUrl) {
				if (updatedPost.fileUrl.includes("/image/")) {
					setPostFile(
						updatedPost.fileUrl.split(
							"http://localhost:8000/image/"
						)[1]
					);
				} else if (updatedPost.fileUrl.includes("/video/")) {
					setPostFile(
						updatedPost.fileUrl.split(
							"http://localhost:8000/video/"
						)[1]
					);
				} else if (updatedPost.fileUrl.includes("/audio/")) {
					setPostFile(
						updatedPost.fileUrl.split(
							"http://localhost:8000/audio/"
						)[1]
					);
				}
			}
		};
		handleFile();
	}, [updatedPost.fileUrl, filewatch]);

	const resetBtn = () => {
		reset();
		setResetUpdEffect(true);
	};

	const backBtn = () => {
		setBackBtnEffect(true);
		router.refresh();
	};

	const handleFileDelete = () => {
		setFileDeleteEffect(true);
		const data = { fileUrl: "" };
		setTimeout(async () => {
			try {
				const answer = window.confirm(
					"Are you sure you want to delete this file from your post?"
				);
				if (answer) {
					await axiosAuth({
						method: "put",
						url: `/posts/${post.id}`,
						data: data,
					}).then(async (response) => {
						if (response) {
							console.log("file removed", response);
							setUpdatedPost({ ...updatedPost, fileUrl: null });
						}
					});
				}
			} catch (err) {
				console.log("del file err : ", err);
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				} else {
					setErrMsg("File removal failed, please try again.");
				}
			}
		}, 500);
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
			<section className="my-[2.4rem] flex flex-col items-center border-apppastgreen dark:border-applightdark bg-apppastgreen dark:bg-applightdark bg-opacity-70 border-2 w-[92%] mx-auto rounded-lg shadow-neatcard lg:w-[60%]">
				<div className="flex flex-col items-center w-full">
					<form
						className="mb-[0.4rem] py-[3.2rem] flex flex-col items-center text-clamp6 w-full z-0 gap-[2rem]"
						onSubmit={handleSubmit(submitUpdateForm)}>
						<div className="flex gap-[1rem]">
							<input
								type="text"
								placeholder="A title..."
								{...register("title")}
								className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] lg:w-[45vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${
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
										onClick={() => handleShowEmojiT()}
										onKeyUp={(e) => {
											if (e.key === "Enter")
												handleShowEmojiT();
										}}
										onAnimationEnd={() =>
											setEmojiTBtnClickEffect(false)
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
						<div className="flex justify-center w-full gap-[1rem]">
							<textarea
								type="text"
								placeholder="Your message..."
								{...register("content", {
									required: "This field is required",
								})}
								className={`border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[70%] h-[5.6rem] resize min-w-[11rem] min-h-[2.6rem] max-h-[13.9rem] max-w-[80%] mob88:max-h-[11.6rem] lg:max-w-[90%] ${
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
										onClick={() => handleShowEmojiC()}
										onKeyUp={(e) => {
											if (e.key === "Enter")
												handleShowEmojiC();
										}}
										onAnimationEnd={() =>
											setEmojiCBtnClickEffect(false)
										}
									/>
								</div>
							</div>
						</div>

						{errors.content && (
							<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mb-[2rem]">
								{errors.content.message}
							</span>
						)}
						{/* emoji pickers */}
						{showTEmojiPicker && (
							<div className="">
								<Picker
									onEmojiClick={handleTEmojiClick}
									className="bg-appmauvedark"
								/>
							</div>
						)}
						{showCEmojiPicker && (
							<div className="">
								<Picker
									onEmojiClick={handleCEmojiClick}
									className="bg-appmauvedark"
								/>
							</div>
						)}

						<button
							type="button"
							title="select file"
							className={`relative my-[0.4rem] w-[5.7rem] h-[4rem] mob88:w-[4rem] mob88:h-[3rem] rounded-xl cursor-pointer hover:opacity-70 ${
								fileWiggle && "animate-wiggle"
							}`}
							onClick={() => {
								setFileWiggle(true);
								document.getElementById("fileUrl").click();
							}}
							onAnimationEnd={() => setFileWiggle(false)}>
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
								size="2x"
								className="mob88:max-w-[2.8rem] mob88:max-h-[2.8rem] text-appstone dark:text-appmauvedark absolute left-[0px] top-[0.3rem] -z-20"
							/>
							<FontAwesomeIcon
								icon={faMusic}
								size="2x"
								style={
									errors.fileUrl
										? { color: "#FD2D01" }
										: { color: "#b1ae99" }
								}
								className="absolute left-[1.8rem] mob88:left-[1.3rem] top-[0.3rem] -z-10 mob88:max-w-[2.6rem] mob88:max-h-[2.6rem]"
							/>
						</button>
						{filewatch?.[0]?.name && (
							<p
								className={`max-w-[90%] mx-[0.8rem] text-ellipsis overflow-hidden 
                        ${
							errors.fileUrl
								? "text-red-600 mt-[0.4rem] mb-[0.8rem] bg-white underline underline-offset-2 font-semibold"
								: "mb-[1.2rem]"
						}`}>
								{filewatch[0].name}
							</p>
						)}
						{!filewatch?.[0]?.name && updatedPost.fileUrl && (
							<>
								<p className="mx-[1.2rem] mb-[0.4rem]">
									No file selected
								</p>
								<p className="max-w-[90%] mx-[1.2rem] text-ellipsis overflow-hidden">
									Post file: {postFile}
								</p>{" "}
							</>
						)}
						{!filewatch && !updatedPost?.fileUrl ? (
							<p className="mx-[1.2rem]">No file selected</p>
						) : (
							filewatch &&
							!filewatch?.[0]?.name &&
							!updatedPost.fileUrl && (
								<p className="mx-[1.2rem] mb-[1.2rem]">
									No file selected
								</p>
							)
						)}
						{updatedPost.fileUrl && (
							<button
								type="button"
								title="delete file"
								onClick={() => handleFileDelete()}
								onAnimationEnd={() =>
									setFileDeleteEffect(false)
								}
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
						{errors.fileUrl && (
							<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mb-[1.6rem]">
								{errors.fileUrl.message}
							</span>
						)}

						<input
							type="text"
							placeholder="A link..."
							{...register("link")}
							className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] lg:w-[45vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${
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
								onClick={() => resetBtn()}
								onAnimationEnd={() => setResetUpdEffect(false)}
								className={`bg-[#FF7900] text-appblck text-[1.8rem] w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
									resetUpdEffect &&
									"animate-pressDown bg-apppastgreen"
								}`}>
								<FontAwesomeIcon icon={faEraser} />
							</button>
							<button
								type="submit"
								title="submit update"
								aria-disabled={isDisabled}
								onClick={(e) => {
									isDisabled
										? e.preventDefault()
										: setPostUpdEffect(true);
								}}
								onAnimationEnd={() => setPostUpdEffect(false)}
								className={`flex items-center justify-center bg-appstone dark:bg-appmauvedark text-white w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mt-[0.8rem] mb-[0.8rem] px-[0.925rem] shadow-neatcard ${
									postUpdEffect &&
									"animate-pressDown bg-apppastgreen"
								} ${
									isDisabled
										? "opacity-50 cursor-not-allowed"
										: "transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue "
								}`}>
								<FontAwesomeIcon icon={faPenFancy} />
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
									className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit mob00:mx-0 mob00:w-[92%] px-[0.8rem] text-clamp6 my-[1.2rem]"
									role="alert"
									aria-live="assertive">
									{errMsg}
								</motion.p>
							)}
						</AnimatePresence>
					</form>
				</div>
			</section>
			<nav
				onClick={() => backBtn()}
				onAnimationEnd={() => setBackBtnEffect(false)}
				className="flex justify-center">
				<a
					title="back to post"
					href={`/thread?page=${pg}&per_page=6#${post.id}`}
					className={`bg-[#FF7900] text-appblck rounded-xl flex justify-center items-center w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem]  transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange m-0 shadow-neatcard ${
						backBtnEffect && "animate-pressDown bg-apppastgreen"
					}`}>
					<FontAwesomeIcon icon={faLeftLong} size="2xl" />
				</a>
			</nav>
		</>
	);
}

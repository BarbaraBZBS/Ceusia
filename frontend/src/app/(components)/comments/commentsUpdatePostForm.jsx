import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMusic,
	faPenFancy,
	faPhotoFilm,
	faEraser,
	faFileCircleXmark,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useForm } from "react-hook-form";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FocusOn } from "react-focus-on";

export default function CommentsUpdatePostForm({
	postDetail,
	setPostDetail,
	hideFormOverlay,
	blur,
	setBlur,
}) {
	const axiosAuth = useAxiosAuth();
	const [cancelUpdBtnEffect, setCancelUpdBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [postFile, setPostFile] = useState();
	const [fileDeleteEffect, setFileDeleteEffect] = useState(false);
	const [postUpdEffect, setPostUpdEffect] = useState(false);
	const [resetUpdEffect, setResetUpdEffect] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [showTEmojiPicker, setShowTEmojiPicker] = useState(false);
	const [showCEmojiPicker, setShowCEmojiPicker] = useState(false);
	const [emojiTBtnClickEffect, setEmojiTBtnClickEffect] = useState(false);
	const [emojiCBtnClickEffect, setEmojiCBtnClickEffect] = useState(false);
	const [isSent, setIsSent] = useState(false);

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
			title: postDetail.title,
			content: postDetail.content,
			fileUrl: postDetail.fileUrl,
			link: postDetail.link,
		},
		mode: "onSubmit",
	});
	const filewatch = watch("fileUrl");
	// console.log( 'file : ', filewatch )
	const ttl = watch("title");
	const ctt = watch("content");
	const lnk = watch("link");
	const isDisabled =
		ttl == postDetail.title &&
		ctt == postDetail.content &&
		!filewatch?.[0]?.name &&
		lnk == postDetail.link;

	//set focus on first form input when page loads
	useEffect(() => {
		if (errors?.content) {
			setFocus("content");
		}
	});

	//post update function
	const refreshPost = async () => {
		const resp = await axiosAuth.get(`/posts/${postDetail.id}`);
		setPostDetail(resp.data);
		return resp.data;
	};

	//back button function
	const cancelbackBtn = () => {
		setCancelUpdBtnEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			hideFormOverlay();
		}, 500);
	};

	//reset form button function
	const resetBtn = async () => {
		setResetUpdEffect(true);
		const data = await refreshPost();
		reset({ ...data });
	};

	//submit form function
	const submitUpdateForm = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
		setIsSent(false);
		let headers;
		if (data.fileUrl <= 0 || data.fileUrl == null) {
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
			data = form;
			headers = { "Content-Type": "multipart/form-data" };
		}
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(async () => {
			try {
				await axiosAuth({
					method: "put",
					url: `/posts/${postDetail.id}`,
					data: data,
					headers: headers,
				}).then(async (response) => {
					if (response) {
						const reload = await refreshPost();
						setIsSent(true);
						setPostDetail(reload);
						hideFormOverlay();
					}
				});
			} catch (err) {
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				}
				if (err.response?.status === 409) {
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
					setErrMsg("Posting failed, please try again.");
				}
			}
		}, 500);
	};

	//delete file from post function
	const handleFileDelete = () => {
		setFileDeleteEffect(true);
		const data = { fileUrl: "" };
		setTimeout(async () => {
			try {
				let answer = window.confirm(
					"Are you sure you want to delete this file from your post?"
				);
				if (answer) {
					await axiosAuth({
						method: "put",
						url: `/posts/${postDetail.id}`,
						data: data,
					}).then(async (response) => {
						if (response) {
							//console.log("file removed", response);
							setPostDetail({ ...postDetail, fileUrl: null });
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
					setErrMsg("Failed removing file, please try again.");
				}
			}
		}, 600);
	};

	//rename file for display function
	useEffect(() => {
		const handleFile = () => {
			if (postDetail?.fileUrl) {
				if (postDetail.fileUrl.includes("/image/")) {
					setPostFile(postDetail.fileUrl.split("/image/")[1]);
				} else if (postDetail.fileUrl.includes("/video/")) {
					setPostFile(postDetail.fileUrl.split("/video/")[1]);
				} else if (postDetail.fileUrl.includes("/audio/")) {
					setPostFile(postDetail.fileUrl.split("/audio/")[1]);
				}
			}
		};
		handleFile();
	}, [postDetail.fileUrl, filewatch]);

	//reset form after submit if ok function
	useEffect(() => {
		const resetForm = () => {
			if (isSubmitSuccessful && isSent) {
				setTimeout(async () => {
					setErrMsg("");
					const resp = await axiosAuth.get(`/posts/${postDetail.id}`);
					setPostDetail(resp.data);
				}, 600);
			}
		};
		resetForm();
	}, [isSubmitSuccessful, isSent, axiosAuth, setPostDetail, postDetail.id]);

	//hide or show emoji picker for title function
	const handleTEmojiPickerHideShow = () => {
		setShowTEmojiPicker(!showTEmojiPicker);
		setShowCEmojiPicker(false);
	};

	//hide or show emoji picker for content function
	const handleCEmojiPickerHideShow = () => {
		setShowCEmojiPicker(!showCEmojiPicker);
		setShowTEmojiPicker(false);
	};

	//manage clicking emoji for title function
	const handleTEmojiClick = (emoji) => {
		let message = getValues("title");
		message += emoji.emoji;
		setValue("title", message);
	};

	//manage clicking emoji for content function
	const handleCEmojiClick = (emoji) => {
		let message = getValues("content");
		message += emoji.emoji;
		setValue("content", message);
	};

	//manage how emoji picker for title is opened function
	const handleShowEmojiT = () => {
		setEmojiTBtnClickEffect(true);
		setTimeout(() => {
			handleTEmojiPickerHideShow();
		}, 400);
	};

	//manage how emoji picker for content is opened function
	const handleShowEmojiC = () => {
		setEmojiCBtnClickEffect(true);
		setTimeout(() => {
			handleCEmojiPickerHideShow();
		}, 400);
	};

	return (
		<motion.section
			initial={{ x: -100, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -100, opacity: 0 }}
			transition={{
				duration: 0.4,
				delay: 0.25,
			}}
			className={`fixed left-0 top-0 w-screen h-full z-[998] ${
				blur && "animate-pop"
			}`}>
			<FocusOn
				onClickOutside={() => cancelbackBtn()}
				onEscapeKey={() => cancelbackBtn()}>
				<div
					role="dialog"
					aria-labelledby="upd-ttl"
					className="absolute bg-appsand dark:bg-applightdark border-2 border-appsand dark:border-applightdark top-[0.05rem] left-[calc(50vw-(94vw/2))] p-3 w-[94%] lg:w-[60%] lg:left-[calc(50vw-(60vw/2))] rounded-xl shadow-elevated">
					<div className="flex justify-end">
						<button
							onClick={() => cancelbackBtn()}
							aria-label="close update"
							className="w-fit">
							<FontAwesomeIcon
								icon={faXmark}
								size="2xl"
								onAnimationEnd={() =>
									setCancelUpdBtnEffect(false)
								}
								className={`cursor-pointer hover:text-appred ${
									cancelUpdBtnEffect &&
									"animate-pressed opacity-60"
								}`}
							/>
						</button>
					</div>

					<form
						className="flex flex-col z-[999] mx-auto h-auto items-center text-clamp6 py-[2.4rem] gap-[1rem]"
						onSubmit={handleSubmit(submitUpdateForm)}>
						<h1
							id="upd-ttl"
							className="text-clamp5 mob00:text-clamp7 mb-[2.4rem] uppercase font-semibold">
							Update your post
						</h1>
						<div className="flex gap-[1rem]">
							<input
								type="text"
								placeholder={"A title..."}
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
						<div className="flex justify-center gap-[1rem] w-[100%]">
							<textarea
								type="text"
								placeholder="Your message..."
								{...register("content", {
									required: "This field is required",
								})}
								className={`border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-full h-[5.6rem] resize max-w-[80%] lg:max-w-[90%] min-w-[11rem] min-h-[2.6rem] max-h-[22.8rem] mob88:max-w-[20.7rem] mob88:max-h-[11.6rem] ${
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
							className={`relative my-[0.4rem] w-[5.1rem] h-[3.7rem] mob88:w-[4rem] mob88:h-[3rem] rounded-xl cursor-pointer hover:opacity-70 ${
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
								className="mob88:max-w-[2.8rem] mob88:max-h-[2.8rem] text-appstone dark:text-appmauvedark absolute left-[0px] top-[0.3rem]"
							/>
							<FontAwesomeIcon
								icon={faMusic}
								size="2x"
								style={
									errors.fileUrl
										? { color: "#FD2D01" }
										: { color: "#b1ae99" }
								}
								className="absolute left-[1.8rem] mob88:left-[1.3rem] top-[0.3rem] mob88:max-w-[2.6rem] mob88:max-h-[2.6rem]"
							/>
						</button>
						{filewatch?.[0]?.name && (
							<p
								className={`max-w-[90%] mx-[0.8rem] line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                        ${
							errors.fileUrl
								? "text-red-600 mt-[0.4rem] mb-[0.8rem] bg-white underline underline-offset-2 font-semibold"
								: "mb-[1.2rem]"
						}`}>
								{filewatch[0].name}
							</p>
						)}
						{!filewatch?.[0]?.name && postDetail.fileUrl && (
							<>
								<p className="mx-[1.2rem]">No file selected</p>
								<p className="max-w-[90%] mx-[1.2rem] text-ellipsis overflow-hidden">
									Post file: {postFile}
								</p>{" "}
							</>
						)}
						{!filewatch && !postDetail?.fileUrl ? (
							<p className="mx-[1.2rem]">No file selected</p>
						) : (
							filewatch &&
							!filewatch?.[0]?.name &&
							!postDetail.fileUrl && (
								<p className="mx-[1.2rem]">No file selected</p>
							)
						)}
						{postDetail.fileUrl && (
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
								className={`bg-[#FF7900] text-appblck w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
									resetUpdEffect && "animate-pressDown"
								}`}>
								<FontAwesomeIcon icon={faEraser} size="lg" />
							</button>
							<button
								type="submit"
								title="confirm update"
								aria-disabled={isDisabled}
								onClick={(e) => {
									isDisabled
										? e.preventDefault()
										: setPostUpdEffect(true);
								}}
								onAnimationEnd={() => setPostUpdEffect(false)}
								className={`flex justify-center items-center bg-appstone dark:bg-appmauvedark text-white w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mt-[0.8rem] mb-[0.8rem] shadow-neatcard ${
									postUpdEffect && "animate-pressDown"
								} ${
									isDisabled
										? "opacity-50 cursor-not-allowed"
										: "transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue "
								}`}>
								<FontAwesomeIcon
									icon={faPenFancy}
									className="text-[2.2rem] mob88:text-[1.6rem]"
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
									className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 my-[1.2rem]"
									role="alert"
									aria-live="assertive">
									{errMsg}
								</motion.p>
							)}
						</AnimatePresence>
					</form>
				</div>
			</FocusOn>
		</motion.section>
	);
}

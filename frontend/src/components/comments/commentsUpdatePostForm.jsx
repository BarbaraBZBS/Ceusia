import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMusic,
	faPenFancy,
	faPhotoFilm,
	faShareFromSquare,
	faComments,
	faPlus,
	faShare,
	faPenToSquare,
	faEraser,
	faLeftLong,
	faXmark,
	faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function CommentsUpdatePostForm({
	postDetail,
	setPostDetail,
	setUpdatedPostDetail,
	hideFormOverlay,
	blur,
	setBlur,
}) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const [cancelUpdBtnEffect, setCancelUpdBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
	const [postFile, setPostFile] = useState();
	const [fileDeleteEffect, setFileDeleteEffect] = useState(false);
	const [postUpdEffect, setPostUpdEffect] = useState(false);
	const [resetUpdEffect, setResetUpdEffect] = useState(false);
	const [backBtnEffect, setBackBtnEffect] = useState(false);
	//const [blur, setBlur] = useState(false);
	const [errMsg, setErrMsg] = useState("");

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
			title: postDetail.title,
			content: postDetail.content,
			fileUrl: postDetail.fileUrl,
			link: postDetail.link,
		},
		mode: "onSubmit",
		// reValidateMode: "onBlur"
	});
	const filewatch = watch("fileUrl");
	// console.log( 'file : ', filewatch )
	const ttl = watch("title");
	const ctt = watch("content");
	const lnk = watch("link");
	// console.log( 'post details : ', postDetail )
	useEffect(() => {
		if (errors?.content) {
			setFocus("content");
		}
	});
	const refreshPost = async () => {
		const resp = await axiosAuth.get(`/posts/${postDetail.id}`);
		setPostDetail(resp.data);
		return resp.data;
	};
	const cancelbackBtn = () => {
		setCancelUpdBtnEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			hideFormOverlay();
		}, 500);
	};
	const resetBtn = async () => {
		setResetUpdEffect(true);
		const data = await refreshPost();
		reset({ ...data });
	};
	const submitUpdateForm = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
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
			// console.log( 'file upload? : ', form );
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
						// console.log( response );
						const reload = await refreshPost();
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
						url: `/posts/${post.id}`,
						data: data,
					}).then(async (response) => {
						if (response) {
							// console.log( 'file removed', response );
							const res = await axiosAuth.get(
								`/posts/${post.id}`
							);
							setUpdatedPostDetail(res.data);
							setPostDetail(res.data);
						}
					});
				}
			} catch (err) {
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
	useEffect(() => {
		const handleFile = () => {
			if (postDetail?.fileUrl) {
				if (postDetail.fileUrl.includes("/image/")) {
					setPostFile(
						postDetail.fileUrl.split(
							"http://localhost:8000/image/"
						)[1]
					);
				} else if (postDetail.fileUrl.includes("/video/")) {
					setPostFile(
						postDetail.fileUrl.split(
							"http://localhost:8000/video/"
						)[1]
					);
				} else if (postDetail.fileUrl.includes("/audio/")) {
					setPostFile(
						postDetail.fileUrl.split(
							"http://localhost:8000/audio/"
						)[1]
					);
				}
			}
		};
		handleFile();
	}, [postDetail.fileUrl, filewatch]);

	useEffect(() => {
		const resetForm = () => {
			if (isSubmitSuccessful) {
				setTimeout(async () => {
					setErrMsg("");
					const resp = await axiosAuth.get(`/posts/${postDetail.id}`);
					reset({ ...resp.data });
				}, 600);
			}
		};
		resetForm();
	});

	return (
		<motion.section
			initial={{ x: -100, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -100, opacity: 0 }}
			transition={{}}
			className={`fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full z-[998] block py-[1.2rem] ${
				blur && "animate-pop"
			}`}>
			{" "}
			<div className="flex flex-col mx-auto bg-appsand border-2 border-appsand w-[90%] items-center mt-[5.6rem] rounded-xl shadow-elevated">
				<form
					className="flex flex-col z-[999] mx-auto h-auto items-center text-clamp6 mt-[2.4rem] mb-[1.2rem] py-[2.4rem]"
					onSubmit={handleSubmit(submitUpdateForm)}>
					<h1 className="text-clamp4 mb-[2.4rem] uppercase font-semibold">
						Update your post
					</h1>
					<input
						type="text"
						placeholder={"A title..."}
						{...register("title")}
						className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred mb-[2.4rem] ${
							errors.title
								? "border-appred focus:border-appred"
								: ""
						}`}
					/>
					{errors.title && (
						<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
							{errors.title.message}
						</span>
					)}
					<textarea
						type="text"
						placeholder="Your message..."
						{...register("content", {
							required: "This field is required",
						})}
						className={`border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-full h-[5.6rem] resize max-w-[31rem] mb-[2.4rem] ${
							errors.content
								? "border-appred focus:border-appred"
								: ""
						}`}
					/>
					{errors.content && (
						<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mb-[2rem]">
							{errors.content.message}
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
							name="fileUrl"
							placeholder="A video, image, or audio file..."
							{...register("fileUrl")}
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
								errors.fileUrl
									? { color: "#FD2D01" }
									: { color: "#b1ae99" }
							}
							className="absolute left-[1.8rem] top-[0.3rem] -z-10"
						/>
					</div>
					{filewatch?.[0]?.name && (
						<p
							className={`max-w-[30rem] mx-[0.8rem] line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
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
							<p className="mx-[1.2rem] mb-[0.4rem]">
								No file selected
							</p>
							<p className="max-w-[32.5rem] mx-[1.2rem] mb-[1.2rem] text-ellipsis overflow-hidden">
								Post file: {postFile}
							</p>{" "}
						</>
					)}
					{!filewatch && !postDetail?.fileUrl ? (
						<p className="mx-[1.2rem] mb-[1.2rem]">
							No file selected
						</p>
					) : (
						filewatch &&
						!filewatch?.[0]?.name &&
						!postDetail.fileUrl && (
							<p className="mx-[1.2rem] mb-[1.2rem]">
								No file selected
							</p>
						)
					)}
					{postDetail.fileUrl && (
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
					{errors.fileUrl && (
						<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md mb-[1.6rem]">
							{errors.fileUrl.message}
						</span>
					)}
					<input
						type="text"
						placeholder="A link..."
						{...register("link")}
						className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred mb-[2.4rem] ${
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
							className={`bg-[#FF7900] text-appblck w-[3.6rem] h-[3.6rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
								resetUpdEffect && "animate-pressDown"
							}`}>
							<FontAwesomeIcon icon={faEraser} size="lg" />
						</button>
						<button
							type="submit"
							title="confirm update"
							disabled={
								ttl == postDetail.title &&
								ctt == postDetail.content &&
								!filewatch?.[0]?.name &&
								lnk == postDetail.link
							}
							onClick={() => setPostUpdEffect(true)}
							onAnimationEnd={() => setPostUpdEffect(false)}
							className={`bg-appstone text-white w-[3.6rem] h-[3.6rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50 shadow-neatcard ${
								postUpdEffect && "animate-pressDown"
							}`}>
							<FontAwesomeIcon icon={faPenFancy} size="lg" />
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
				<div className="flex justify-center">
					<button
						title="back to post"
						onClick={() => cancelbackBtn()}
						onAnimationEnd={() => setCancelUpdBtnEffect(false)}
						className={`bg-[#FF7900] text-appblck w-[3.6rem] h-[3.6rem] rounded-xl mt-[0.8rem] mb-[1.6rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
							cancelUpdBtnEffect && "animate-pressDown"
						}`}>
						<FontAwesomeIcon icon={faLeftLong} size="2xl" />
					</button>
				</div>
			</div>
		</motion.section>
	);
}

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
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function ModifyPost({ post }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pg = searchParams.get("pg") ?? "1";
	const axiosAuth = useAxiosAuth();
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
	const filewatch = watch("fileUrl");
	// console.log( filewatch );
	const [postFile, setPostFile] = useState();
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
			try {
				await axiosAuth({
					method: "put",
					url: `/posts/${post.id}`,
					data: data,
					headers: headers,
				}).then(async (response) => {
					if (response) {
						console.log(response);
						const resp = await axiosAuth.get(`/posts/${post.id}`);
						reset({ ...resp.data });
						router.push(
							`/thread?page=${pg}&per_page=6#${post.id}`,
							{ scroll: true }
						);
						router.refresh();
					}
				});
			} catch (err) {
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
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
					setErrMsg("Updating failed, please try again.");
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}
		}, 600);
	};

	useEffect(() => {
		const handleFile = () => {
			if (post?.fileUrl) {
				if (post.fileUrl.includes("/image/")) {
					setPostFile(
						post.fileUrl.split("http://localhost:8000/image/")[1]
					);
				} else if (post.fileUrl.includes("/video/")) {
					setPostFile(
						post.fileUrl.split("http://localhost:8000/video/")[1]
					);
				} else if (post.fileUrl.includes("/audio/")) {
					setPostFile(
						post.fileUrl.split("http://localhost:8000/audio/")[1]
					);
				}
			}
		};
		handleFile();
	}, [post.fileUrl, filewatch]);

	const resetBtn = () => {
		reset();
		setResetUpdEffect(true);
	};

	const backBtn = () => {
		setBackBtnEffect(true);
		reset();
		router.refresh();
	};

	//useEffect(() => {
	//	const resetForm = async () => {
	//		if (isSubmitSuccessful) {
	//			//setTimeout(async () => {
	//			setErrMsg("");
	//			const resp = await axiosAuth.get(`/posts/${post.id}`);
	//			reset({ ...resp.data });
	//			//}, 50);
	//		}
	//	};
	//	resetForm();
	//}, [isSubmitSuccessful, axiosAuth, post.id, reset]);

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
							const res = await axiosAuth.get(
								`/posts/${post.id}`
							);
							setUpdatedPost(res.data);
						}
					});
				}
			} catch (err) {
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

	return (
		<>
			<section className="my-[2.4rem] flex flex-col items-center border-apppastgreen bg-apppastgreen bg-opacity-70 border-2 w-[92%] mx-auto rounded-lg shadow-neatcard">
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
				<div className="flex flex-col items-center w-full">
					<form
						className="mb-[0.4rem] py-[3.2rem] flex flex-col items-center text-clamp6 w-full z-0"
						onSubmit={handleSubmit(submitUpdateForm)}>
						<input
							type="text"
							placeholder="A title..."
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
								className="border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred file:cursor-pointer w-[5.1rem] h-[2.9rem] mb-[0.4rem] opacity-0 cursor-pointer"
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
						{!filewatch?.[0]?.name && updatedPost.fileUrl && (
							<>
								<p className="mx-[1.2rem] mb-[0.4rem]">
									No file selected
								</p>
								<p className="max-w-[32.5rem] mx-[1.2rem] mb-[1.2rem] text-ellipsis overflow-hidden">
									Post file: {postFile}
								</p>{" "}
							</>
						)}
						{!filewatch && !updatedPost?.fileUrl ? (
							<p className="mx-[1.2rem] mb-[1.2rem]">
								No file selected
							</p>
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
								className={`bg-[#FF7900] text-appblck text-[1.8rem] w-[3.6rem] h-[3.6rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
									resetUpdEffect &&
									"animate-pressDown bg-apppastgreen"
								}`}>
								<FontAwesomeIcon icon={faEraser} />
							</button>
							<button
								type="submit"
								title="submit update"
								disabled={
									ttl == post.title &&
									ctt == post.content &&
									!filewatch?.[0]?.name &&
									lnk == post.link
								}
								onClick={() => setPostUpdEffect(true)}
								onAnimationEnd={() => setPostUpdEffect(false)}
								className={`bg-appstone text-white w-[3.6rem] h-[3.6rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50 px-[0.925rem] shadow-neatcard ${
									postUpdEffect &&
									"animate-pressDown bg-apppastgreen"
								}`}>
								<FontAwesomeIcon icon={faPenFancy} />
							</button>
						</div>
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
					className={`bg-[#FF7900] text-appblck rounded-xl flex justify-center items-center w-[3.6rem] h-[3.6rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange m-0 shadow-neatcard ${
						backBtnEffect && "animate-pressDown bg-apppastgreen"
					}`}>
					<FontAwesomeIcon icon={faLeftLong} size="2xl" />
				</a>
			</nav>
		</>
	);
}

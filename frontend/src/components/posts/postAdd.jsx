"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPhotoFilm,
	faMusic,
	faEraser,
	faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// eslint-disable-next-line max-len
const LINK_REGEX = /^https?:\/\//gm;
//or this one to match domains extensions and base urls
// const LINK_REGEX = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/

export default function PostAdd({ setPosts }) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();
	const page = searchParams.get("page");
	const [resetBtnEffect, setResetBtnEffect] = useState(false);
	const [sendBtnEffect, setSendBtnEffect] = useState(false);
	const [fileWiggle, setFileWiggle] = useState(false);
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
			title: "",
			content: "",
			fileUrl: "",
			link: "",
		},
		mode: "onSubmit",
	});
	const filewatch = watch("fileUrl");

	useEffect(() => {
		if (errors?.content) {
			setFocus("content");
		}
	});

	const submitForm = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
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
		try {
			await axiosAuth({
				method: "post",
				url: `/posts`,
				data: data,
				headers: headers,
				withCredentials: true,
			}).then(async (response) => {
				console.log(response);
				if (Number(page) > 1) {
					router.replace("?page=1&per_page=6");
				} else {
					router.refresh();
				}
			});
		} catch (err) {
			if (!err?.response) {
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
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	const btnReset = () => {
		setResetBtnEffect(true);
		reset();
	};

	return (
		<section>
			<AnimatePresence>
				{errMsg && (
					<motion.p
						initial={{ x: 70, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: 70, opacity: 0 }}
						transition={{ type: "popLayout" }}
						className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 my-[1.2rem]"
						aria-live="assertive">
						{errMsg}
					</motion.p>
				)}
			</AnimatePresence>
			{/* <div>preview?</div> */}
			<div className="flex flex-col items-center w-full">
				<form
					className="mb-[0.4rem] py-[0.4rem] flex flex-col items-center text-clamp6 w-full"
					onSubmit={handleSubmit(submitForm)}>
					<input
						type="text"
						placeholder="A title..."
						{...register("title")}
						className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${
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
						className={`border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[90%] h-[5.6rem] resize max-w-full ${
							errors.content
								? "border-appred focus:border-appred"
								: ""
						}`}
					/>
					{errors.content && (
						<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
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
							className="border-2 border-appstone rounded-md my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc text-center focus:border-apppink focus:outline-none focus:invalid:border-appred w-[5.1rem] h-[2.9rem] opacity-0 file:cursor-pointer"
						/>
						<FontAwesomeIcon
							icon={faPhotoFilm}
							size="2xl"
							style={{ color: "#4E5166" }}
							className="absolute left-[0rem] top-[0.3rem] -z-20"
						/>
						<FontAwesomeIcon
							icon={faMusic}
							size="2xl"
							style={
								errors.fileUrl
									? { color: "#FD2D01" }
									: { color: "#b1ae99" }
							}
							className="absolute left-[1.8rem] top-[0.3rem] -z-10"
						/>
					</div>
					{filewatch && filewatch[0] ? (
						<p
							className={`max-w-[32.5rem] mx-[0.8rem] line-clamp-1 hover:line-clamp-none hover:text-ellipsis hover:overflow-hidden active:line-clamp-none active:text-ellipsis active:overflow-hidden 
                                ${
									errors.fileUrl
										? "text-red-600 underline underline-offset-2 font-semibold"
										: ""
								}`}>
							{filewatch[0].name}
						</p>
					) : (
						<p className="mx-[1.2rem]">No file selected</p>
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
								message: "Enter a valid link url",
							},
						})}
						className={`border-2 border-appstone rounded-md h-[2.4rem] my-[0.4rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc w-[70vw] text-center focus:border-apppink focus:outline-none focus:invalid:border-appred ${
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
							onAnimationEnd={() => setResetBtnEffect(false)}
							className={`bg-[#FF7900] text-appblck w-[3.5rem] h-[3.5rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange shadow-neatcard ${
								resetBtnEffect && "animate-pressDown"
							}`}>
							<FontAwesomeIcon icon={faEraser} size="lg" />
						</button>
						<button
							type="submit"
							title="send a new post"
							onClick={() => setSendBtnEffect(true)}
							onAnimationEnd={() => setSendBtnEffect(false)}
							className={`bg-appstone text-white w-[3.5rem] h-[3.5rem] rounded-xl mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:enabled:bg-appopred hover:enabled:text-appblck hover:enabled:translate-y-[7px] hover:enabled:shadow-btnblue disabled:opacity-50 shadow-neatcard ${
								sendBtnEffect && "animate-pressDown"
							}`}>
							<FontAwesomeIcon icon={faCirclePlus} size="lg" />
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}

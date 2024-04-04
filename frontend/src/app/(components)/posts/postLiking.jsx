"use client";
import React, { useContext, useEffect, useState } from "react";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faThumbsUp as thumbupempty,
	faThumbsDown as thumbdownempty,
} from "@fortawesome/free-regular-svg-icons";
import {
	faThumbsUp as thumbupfull,
	faThumbsDown as thumbdownfull,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../ChatContext";

export default function PostLiking({ post, session }) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [likes, setLikes] = useState(post.likes);
	const [dislikes, setDislikes] = useState(post.dislikes);
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);
	const [likeEffect, setLikeEffect] = useState(false);
	const [dislikeEffect, setDislikeEffect] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const { socket } = useContext(ChatContext);

	//like post function
	const like = async () => {
		setErrMsg("");
		try {
			const resp = await axiosAuth.post(`/posts/${post.id}/like`);
			const likeStat = resp.data.message;
			if (likeStat === "post liked") {
				setLiked(true);
				setDisliked(false);
				socket.current.emit("like-post", {
					post_id: post.id,
					sender_id: session?.user.user_id,
					user_id: post.user_id,
				});
			}
			if (likeStat === "post unliked") {
				setLiked(false);
				setDisliked(false);
			}
			const res = await axiosAuth.get(`/posts/${post.id}`);
			setLikes(res.data.likes);
			setDislikes(res.data.dislikes);

			//console.log("checking post like", post);
		} catch (err) {
			if (!err?.response) {
				console.log(err);
				setErrMsg("No response.");
				setTimeout(() => {
					setErrMsg("");
				}, 4000);
			} else {
				console.log(err);
				setErrMsg("Like failed.");
				setTimeout(() => {
					setErrMsg("");
				}, 4000);
			}
		}
	};

	//dislike post function
	const dislike = async () => {
		setErrMsg("");
		try {
			const resp = await axiosAuth.post(`/posts/${post.id}/dislike`);
			const dislikeStat = resp.data.message;
			if (dislikeStat === "post disliked") {
				setDisliked(true);
				setLiked(false);
				socket.current.emit("dislike-post", {
					post_id: post.id,
					sender_id: session?.user?.user_id,
					user_id: post.user_id,
				});
			}
			if (dislikeStat === "post undisliked") {
				setDisliked(false);
				setLiked(false);
			}
			const res = await axiosAuth.get(`/posts/${post.id}`);
			setDislikes(res.data.dislikes);
			setLikes(res.data.likes);
		} catch (err) {
			if (!err?.response) {
				console.log(err);
				setErrMsg("No response.");
				setTimeout(() => {
					setErrMsg("");
				}, 4000);
			} else {
				console.log(err);
				setErrMsg("Dislike failed.");
				setTimeout(() => {
					setErrMsg("");
				}, 4000);
			}
		}
	};

	//like button function
	const likeBtn = () => {
		setLikeEffect(true);
		setTimeout(() => {
			like();
		}, 400);
	};

	//dislike button function
	const dislikeBtn = () => {
		setDislikeEffect(true);
		setTimeout(() => {
			dislike();
		}, 400);
	};

	//handle liked disliked display function
	useEffect(() => {
		const checkLiked = async () => {
			const data = { post_id: post.id };
			const likeRes = await axiosAuth({
				method: "post",
				url: "/posts/likestatus",
				data: data,
			});
			const likeResData = likeRes.data.message;
			if (likeResData === "liked: ") {
				setLiked(true);
				setDisliked(false);
			}
			if (likeResData === "disliked: ") {
				setDisliked(true);
				setLiked(false);
			}
		};
		checkLiked();
	}, [axiosAuth, post, liked, disliked, router, pathname]);

	return (
		<div className="flex flex-col">
			<div className="flex justify-end mx-[0.8rem] text-clamp2">
				{/* likes */}
				<>
					<span
						aria-label={`${likes} likes`}
						className="sr-only"></span>
					<span aria-hidden className="ml-[0.8rem]">
						{likes}
					</span>
					<button
						type="button"
						title={liked ? "unlike" : "like"}
						aria-labelledby={liked ? "unlike" : "like"}
						onClick={() => likeBtn()}
						onAnimationEnd={() => setLikeEffect(false)}
						className={
							liked
								? `cursor-pointer mx-[0.3rem] opacity-50 ${
										likeEffect && "animate-fill"
								  }`
								: `cursor-pointer mx-[0.3rem] ${
										likeEffect && "animate-scale"
								  }`
						}>
						<FontAwesomeIcon
							icon={liked ? thumbupfull : thumbupempty}
							className={
								liked
									? "text-appgreenlight dark:text-green-500 hover:text-appred dark:hover:text-appred hover:opacity-80"
									: "text-appgreenlight dark:text-green-400 hover:text-green-400 dark:hover:text-green-600"
							}
						/>
					</button>
				</>
				{/* dislikes */}
				<>
					<span
						aria-label={`${dislikes} dislikes`}
						className="sr-only"></span>
					<span aria-hidden className="ml-[0.5rem]">
						{dislikes}
					</span>
					<button
						title={disliked ? "remove dislike" : "dislike"}
						onClick={() => dislikeBtn()}
						onAnimationEnd={() => setDislikeEffect(false)}
						className={
							disliked
								? `mx-[0.3rem] cursor-pointer opacity-50 ${
										dislikeEffect && "animate-scale"
								  }`
								: `mx-[0.3rem] cursor-pointer ${
										dislikeEffect && "animate-fill"
								  }`
						}>
						<FontAwesomeIcon
							icon={disliked ? thumbdownfull : thumbdownempty}
							className={
								disliked
									? "text-appred hover:text-appgreenlight"
									: "text-appred hover:text-red-400 dark:hover:text-red-700"
							}
						/>
					</button>
				</>
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
		</div>
	);
}

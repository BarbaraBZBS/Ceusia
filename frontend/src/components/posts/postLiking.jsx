"use client";
import React, { useEffect, useState } from "react";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
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

export default function PostLiking({ post }) {
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

	const like = async () => {
		setErrMsg("");
		try {
			const resp = await axiosAuth.post(`/posts/${post.id}/like`);
			const likeStat = resp.data.message;
			if (likeStat === "post liked !") {
				setLiked(true);
				setDisliked(false);
			}
			if (likeStat === "post unliked !") {
				setLiked(false);
				setDisliked(false);
			}
			const res = await axiosAuth.get(`/posts/${post.id}`);
			setLikes(res.data.likes);
			setDislikes(res.data.dislikes);
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

	const dislike = async () => {
		setErrMsg("");
		try {
			const resp = await axiosAuth.post(`/posts/${post.id}/dislike`);
			const dislikeStat = resp.data.message;
			if (dislikeStat === "post disliked !") {
				setDisliked(true);
				setLiked(false);
			}
			if (dislikeStat === "post dislike removed !") {
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

	const likeBtn = () => {
		like();
		setLikeEffect(true);
	};

	const dislikeBtn = () => {
		dislike();
		setDislikeEffect(true);
	};

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
		<>
			<div className="flex flex-col">
				<div className="flex justify-end mx-[0.8rem] text-clamp2">
					{liked ? (
						<>
							<span className="ml-[0.8rem]">{likes}</span>
							<button
								title="unlike"
								onClick={() => likeBtn()}
								onAnimationEnd={() => setLikeEffect(false)}
								className={`cursor-pointer mx-[0.3rem] opacity-50 ${
									likeEffect && "animate-fill"
								}`}>
								<FontAwesomeIcon
									icon={thumbupfull}
									className="text-appgreenlight hover:text-appred hover:opacity-60"
								/>
							</button>
						</>
					) : (
						<>
							<span className="ml-[0.8rem]">{likes}</span>
							<button
								title="like"
								onClick={() => likeBtn()}
								onAnimationEnd={() => setLikeEffect(false)}
								className={`cursor-pointer mx-[0.3rem] ${
									likeEffect && "animate-scale"
								}`}>
								<FontAwesomeIcon
									icon={thumbupempty}
									className="text-appgreenlight hover:text-green-400"
								/>
							</button>
						</>
					)}
					{disliked ? (
						<>
							<span className="ml-[0.5rem]">{dislikes}</span>
							<button
								title="remove dislike"
								onClick={() => dislikeBtn()}
								onAnimationEnd={() => setDislikeEffect(false)}
								className={`mx-[0.3rem] cursor-pointer opacity-50 ${
									dislikeEffect && "animate-scale"
								}`}>
								<FontAwesomeIcon
									icon={thumbdownfull}
									className="text-appred hover:text-appgreenlight"
								/>
							</button>
						</>
					) : (
						<>
							<span className="ml-[0.5rem]">{dislikes}</span>
							<button
								title="dislike"
								onClick={() => dislikeBtn()}
								onAnimationEnd={() => setDislikeEffect(false)}
								className={`mx-[0.3rem] cursor-pointer ${
									dislikeEffect && "animate-fill"
								}`}>
								<FontAwesomeIcon
									icon={thumbdownempty}
									className="text-appred hover:text-red-400"
								/>
							</button>
						</>
					)}
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
			</div>
		</>
	);
}

"use client";
import React, { useContext, useEffect, useState } from "react";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHeart as heartempty,
	faThumbsUp as thumbupempty,
	faHeartCrack as heartcrackempty,
	faThumbsDown as thumbdownempty,
} from "@fortawesome/free-regular-svg-icons";
import {
	faHeart as heartfull,
	faHeartCrack as heartcrackfull,
	faThumbsUp as thumbupfull,
	faThumbsDown as thumbdownfull,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { ChatContext } from "../ChatContext";

export default function CommentLiking({ post, comment, errorMsg, session }) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [likes, setLikes] = useState(comment.likes);
	const [dislikes, setDislikes] = useState(comment.dislikes);
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);
	const [likeEffect, setLikeEffect] = useState(false);
	const [dislikeEffect, setDislikeEffect] = useState(false);
	const { socket } = useContext(ChatContext);

	const like = async () => {
		errorMsg("");
		try {
			const resp = await axiosAuth.post(
				`/posts/comment/${comment.id}/like`
			);
			const likeStat = resp.data.message;
			if (likeStat === "comment liked !") {
				setLiked(true);
				setDisliked(false);
				socket.current.emit("like-comment", {
					post_id: post.id,
					comment_id: comment.id,
					sender_id: session?.user?.user_id,
					user_id: comment.user_id,
				});
			}
			if (likeStat === "comment unliked !") {
				setLiked(false);
				setDisliked(false);
			}
			const res = await axiosAuth.get(
				`/posts/${post.id}/comment/${comment.id}`
			);
			setLikes(res.data.likes);
			setDislikes(res.data.dislikes);
		} catch (err) {
			if (!err?.response) {
				console.log(err);
				errorMsg("No response.");
				setTimeout(() => {
					errorMsg("");
				}, 4000);
			} else {
				console.log(err);
				errorMsg("Like failed.");
				setTimeout(() => {
					errorMsg("");
				}, 4000);
			}
		}
	};
	const dislike = async () => {
		errorMsg("");
		try {
			const resp = await axiosAuth.post(
				`/posts/comment/${comment.id}/dislike`
			);
			const dislikeStat = resp.data.message;
			if (dislikeStat === "comment disliked !") {
				setDisliked(true);
				setLiked(false);
				socket.current.emit("dislike-comment", {
					post_id: post.id,
					comment_id: comment.id,
					sender_id: session?.user?.user_id,
					user_id: comment.user_id,
				});
			}
			if (dislikeStat === "comment dislike removed !") {
				setDisliked(false);
				setLiked(false);
			}
			const res = await axiosAuth.get(
				`/posts/${post.id}/comment/${comment.id}`
			);
			setDislikes(res.data.dislikes);
			setLikes(res.data.likes);
		} catch (err) {
			if (!err?.response) {
				console.log(err);
				errorMsg("No response.");
				setTimeout(() => {
					errorMsg("");
				}, 4000);
			} else {
				console.log(err);
				errorMsg("Dislike failed.");
				setTimeout(() => {
					errorMsg("");
				}, 4000);
			}
		}
	};

	const likeBtn = () => {
		setLikeEffect(true);
		setTimeout(() => {
			like();
		}, 400);
	};

	const dislikeBtn = () => {
		setDislikeEffect(true);
		setTimeout(() => {
			dislike();
		}, 400);
	};

	useEffect(() => {
		async function checkLiked() {
			const data = { comment_id: comment.id };
			const likeRes = await axiosAuth({
				method: "post",
				url: "posts/commentlikestatus",
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
		}
		checkLiked();
	}, [axiosAuth, comment, liked, disliked, router, pathname]);

	return (
		<div className="text-clamp2">
			{/* likes */}
			<>
				<span aria-label={`${likes} likes`} className="sr-only"></span>
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
							? `mx-[0.3rem] cursor-pointer opacity-50
							${likeEffect && "animate-fill"}
							`
							: `mx-[0.3rem] cursor-pointer
							  ${likeEffect && "animate-scale"}
							`
					}>
					<FontAwesomeIcon
						icon={liked ? heartfull : heartempty}
						className={
							liked
								? "text-appgreenlight hover:text-appred hover:opacity-60"
								: "text-appgreenlight hover:text-green-400"
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
					type="button"
					title={disliked ? "remove dislike" : "dislike"}
					aria-labelledby={disliked ? "remove dislike" : "dislike"}
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
						//icon={heartcrackfull}
						className={
							disliked
								? "text-appred hover:text-appgreenlight"
								: "text-appred hover:text-red-400"
						}
					/>
				</button>
			</>
		</div>
	);
}

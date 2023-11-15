"use client";
import React, { useEffect, useState } from "react";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
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

export default function CommentLiking({ post, comment, errorMsg }) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [likes, setLikes] = useState(comment.likes);
	const [dislikes, setDislikes] = useState(comment.dislikes);
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);
	const [likeEffect, setLikeEffect] = useState(false);
	const [dislikeEffect, setDislikeEffect] = useState(false);

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
		like();
		setLikeEffect(true);
	};
	const dislikeBtn = () => {
		dislike();
		setDislikeEffect(true);
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
		<>
			<div className="text-clamp2">
				{liked ? (
					<>
						<span className="ml-[0.8rem]">{likes}</span>
						<button
							title="unlike"
							onClick={() => likeBtn()}
							onAnimationEnd={() => setLikeEffect(false)}
							className={`mx-[0.3rem] cursor-pointer opacity-50 ${
								likeEffect && "animate-fill"
							}`}>
							<FontAwesomeIcon
								icon={heartfull}
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
							className={`mx-[0.3rem] cursor-pointer ${
								likeEffect && "animate-scale"
							}`}>
							<FontAwesomeIcon
								icon={heartempty}
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
								icon={heartcrackfull}
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
		</>
	);
}

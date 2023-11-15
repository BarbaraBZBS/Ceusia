"use client";
import React, { useState } from "react";
import useAxiosAuth from "@/utils/hooks/useAxiosAuth";
import Image from "next/image";
import PostLiking from "../posts/postLiking";
import LinkVideo from "../posts/linkVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPenFancy,
	faShareFromSquare,
	faComments,
	faPlus,
	faShare,
	faPenToSquare,
	faLeftLong,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import moment from "moment/moment";
import CommentUpdate from "./commentUpdate";
import CommentAdd from "./commentAdd";
import CommentLiking from "./commentLiking";
import { motion, AnimatePresence } from "framer-motion";
import CommentsUpdatePostForm from "./commentsUpdatePostForm";

export default function PostComments({ post, comments }) {
	// console.log( 'coms : ', comments )
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pg = searchParams.get("pg") ?? "1";
	const { data: session } = useSession();
	const [postDetail, setPostDetail] = useState(post);
	const [commentsDetail, setCommentsDetail] = useState(comments);
	const [userPicZoom, setUserPicZoom] = useState(false);
	const [userComPicZoom, setUserComPicZoom] = useState(false);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [usrLinkEffect, setUsrLinkEffect] = useState(false);
	const [mainPostUsrLinkEffect, setMainPostUsrLinkEffect] = useState(false);
	const [modifyBtnEffect, setModifyBtnEffect] = useState(false);
	const [deleteBtnEffect, setDeleteBtnEffect] = useState(false);
	const [commentEffect, setCommentEffect] = useState(false);
	const [shareEffect, setShareEffect] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [newComment, setNewComment] = useState(false);
	const [backBtnEffect, setBackBtnEffect] = useState(false);
	const [blur, setBlur] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [updCommentBtnEffect, setUpdCommentBtnEffect] = useState(false);
	const [updCommentCard, setUpdCommentCard] = useState(false);
	const [delCommentBtnEffect, setDelCommentBtnEffect] = useState(false);
	const [shareCommentBtnEffect, setShareCommentBtnEffect] = useState(false);
	const [commentImgZoom, setCommentImgZoom] = useState(false);
	const [postFocus, setPostFocus] = useState(true);
	//const [updatedPostDetail, setUpdatedPostDetail] = useState(post);
	const isBrowser = () => typeof window !== "undefined";

	const refreshPost = async () => {
		const resp = await axiosAuth.get(`/posts/${post.id}`);
		setPostDetail(resp.data);
		return resp.data;
	};

	const dateParser2 = (num) => {
		const timeAgo = moment(num).fromNow();
		return timeAgo;
	};

	// handle overlays function
	function showOverlay() {
		const scrollY =
			document.documentElement.style.getPropertyValue("--scroll-y");
		const body = document.body;
		body.style.position = "fixed";
		body.style.top = `-${scrollY}`;
	}
	function hideOverlay() {
		const body = document.body;
		const scrollY = body.style.top;
		body.style.position = "";
		body.style.top = "";
		if (!isBrowser()) return;
		window.scrollTo(0, parseInt(scrollY || "0") * -1);
	}
	// post user picture zoom
	function showUsrPicZoomOverlay() {
		setUserPicZoom(true);
		showOverlay();
	}
	function hideUsrPicZoomOverlay() {
		hideOverlay();
		setUserPicZoom(false);
	}
	// comments user pic zoom
	function showUsrPicComZoomOverlay() {
		setUserComPicZoom(true);
		showOverlay();
	}
	function hideUsrPicComZoomOverlay() {
		hideOverlay();
		setUserComPicZoom(false);
	}
	// update post form overlay
	function showFormOverlay() {
		setShowForm(true);
		showOverlay();
	}
	function hideFormOverlay() {
		hideOverlay();
		setShowForm(false);
	}
	function showCommImgZoomOverlay() {
		setCommentImgZoom(true);
		showOverlay();
	}
	function hideCommImgZoomOverlay() {
		hideOverlay();
		setCommentImgZoom(false);
	}

	const modifBtn = () => {
		setModifyBtnEffect(true);
		setTimeout(() => {
			showFormOverlay();
		}, 500);
		setTimeout(() => {
			setBlur(true);
		}, 1300);
	};

	const handleDelete = (postid) => {
		setDeleteBtnEffect(true);
		setErrMsg("");
		setTimeout(async () => {
			try {
				let answer = window.confirm(
					"Are you sure you want to delete this post?"
				);
				if (answer) {
					const res = await axiosAuth.delete(`/posts/${postid}`);
					// console.log( 'deleted ? : ', res )
					if (!res) {
						setErrMsg("Something went wrong, post was not removed");
					} else {
						hideFormOverlay();
						router.refresh();
						router.push("/");
					}
				}
			} catch (err) {
				console.log("delete post err : ", err);
				setErrMsg("Something went wrong, post was not removed");
			}
		}, 700);
	};

	const addComment = () => {
		setCommentEffect(true);
		setTimeout(() => {
			setNewComment(!newComment);
		}, 500);
	};

	const commentUpdBtn = () => {
		setUpdCommentBtnEffect(true);
		setTimeout(() => {
			setUpdCommentCard(!updCommentCard);
		}, 500);
	};

	const handleDeleteComment = (commId) => {
		setErrMsg("");
		setDelCommentBtnEffect(true);
		setTimeout(async () => {
			try {
				let answer = window.confirm(
					"Are you sure you want to delete this comment?"
				);
				if (answer) {
					await axiosAuth
						.delete(`/posts/${post.id}/comment/${commId}`)
						.then(async () => {
							const res = await axiosAuth.get(
								`/posts/${post.id}/comments`
							);
							setCommentsDetail(res.data);
							await refreshPost();
						});
				}
			} catch (err) {
				console.log("delete comment error", err);
				setErrMsg("Something went wrong, comment not removed.");
				await refreshPost();
			}
		}, 600);
	};

	const handleShare = () => {
		setShareEffect(true);
	};

	const handleShareComment = () => {
		setShareCommentBtnEffect(true);
	};

	const backToLast = () => {
		setBackBtnEffect(true);
		setTimeout(() => {
			router.refresh();
		}, 500);
	};

	if (!isBrowser()) return;
	window.addEventListener("scroll", () => {
		document.documentElement.style.setProperty(
			"--scroll-y",
			`${window.scrollY}px`
		);
	});

	return (
		<>
			{/* post */}
			<section className="p-[0.8rem] pb-[1.2rem] border-b-2 shadow-neatcard">
				{/* user pic zoom overlay */}
				{userPicZoom ? (
					<div
						className="fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block"
						onClick={() => hideUsrPicZoomOverlay()}>
						<Image
							width={0}
							height={0}
							priority={true}
							src={postDetail.user.picture}
							alt={`${postDetail.user.username} picture`}
							placeholder="empty"
							className="block m-auto w-[96%] h-auto object-cover my-[4.8rem] rounded-lg animate-rotateZoom"
						/>
					</div>
				) : (
					<div></div>
				)}

				{/* update post form overlay */}
				<AnimatePresence>
					{showForm && (
						<CommentsUpdatePostForm
							postDetail={postDetail}
							setPostDetail={setPostDetail}
							setUpdatedPostDetail={setUpdatedPostDetail}
							hideFormOverlay={hideFormOverlay}
							blur={blur}
							setBlur={setBlur}
						/>
					)}
				</AnimatePresence>

				{/* post card */}
				<div className="flex justify-between">
					<div className="flex text-clamp6 mx-[1.2rem] mt-[0.4rem] touch-auto mb-[0.8rem]">
						<div
							className="w-[2.8rem] h-[2.8rem] rounded-full mr-[0.4rem] border-[1px] border-gray-300 cursor-pointer transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light shadow-strip"
							onClick={() => {
								showUsrPicZoomOverlay();
							}}>
							<Image
								src={postDetail?.user?.picture}
								width={0}
								height={0}
								placeholder="empty"
								className="rounded-full object-cover w-full h-full cursor-pointer"
								alt={`${postDetail?.user?.username} picture`}
							/>
						</div>
						<div className="flex items-end">
							{/* onclick link to user[user_id] params */}
							{session?.user?.user_id === postDetail?.user_id ? (
								<div>
									<p className="mb-[0.5rem] font-medium">
										You
									</p>
								</div>
							) : (
								<nav
									className={`mb-[0.5rem] font-medium hover:text-appturq active:text-appturq focus:text-appturq ${
										mainPostUsrLinkEffect &&
										"animate-resizeBtn"
									}`}
									onClick={() => {
										setMainPostUsrLinkEffect(true);
									}}
									onAnimationEnd={() =>
										setMainPostUsrLinkEffect(false)
									}>
									<a
										href={`/csian/${[postDetail?.user_id]}`}
										as={`/csian/${[postDetail?.user_id]}`}>
										{postDetail?.user?.username}
									</a>
								</nav>
							)}
						</div>
					</div>
					<div className="flex text-clamp2 font-extralight justify-center items-center text-center">
						{postDetail?.editedAt ? (
							postDetail?.editedByAdmin ? (
								<p className="">
									Edited{" "}
									<span className="font-medium text-indigo-500">
										{" "}
										BY ADMIN
									</span>{" "}
									{dateParser2(postDetail.editedAt)}
								</p>
							) : (
								<p className="">
									Edited {dateParser2(postDetail?.editedAt)}
								</p>
							)
						) : (
							<p>Created {dateParser2(postDetail?.createdAt)}</p>
						)}
					</div>
				</div>

				{postDetail?.title ? (
					<div className="">
						<h2 className="text-clamp7 mx-[1.2rem] font-semibold">
							{postDetail?.title}
						</h2>
					</div>
				) : (
					<div></div>
				)}
				{postDetail?.fileUrl &&
					postDetail.fileUrl?.includes("image") && (
						<div className="flex w-[92%] mx-auto my-[2.4rem] touch-auto rounded-xl shadow-card">
							<Image
								width={0}
								height={0}
								placeholder="empty"
								className="object-cover rounded-xl min-w-full w-full h-full"
								src={postDetail.fileUrl}
								alt="postDetail image"
							/>
						</div>
					)}
				{postDetail?.fileUrl &&
					postDetail.fileUrl?.includes("audio") && (
						<div className="flex justify-center mx-auto my-[2.4rem]">
							<audio controls className="rounded-lg">
								<source
									src={postDetail.fileUrl}
									type="audio/mpeg"
								/>
								<source
									src={postDetail.fileUrl}
									type="audio/ogg"
								/>
								<source
									src={postDetail.fileUrl}
									type="audio/wav"
								/>
								Your browser does not support the audio tag.
							</audio>
						</div>
					)}
				{postDetail?.fileUrl &&
					postDetail.fileUrl?.includes("video") && (
						<div className="flex justify-center mx-auto my-[2.4rem] rounded-2xl shadow-card">
							<video
								id={postDetail.id}
								width="100%"
								height="250"
								className="rounded-2xl"
								controls>
								<source
									src={postDetail.fileUrl}
									type={"video/mp4"}
								/>
								<source
									src={postDetail.fileUrl}
									type="video/ogg"
								/>
								<source
									src={postDetail.fileUrl}
									type="video/webM"
								/>
								Your browser does not support HTML5 video.{" "}
							</video>
						</div>
					)}
				{postDetail?.link && (
					<LinkVideo
						postLink={postDetail.link}
						postid={postDetail.id}
						postFocus={postFocus}
					/>
				)}
				<div>
					<p className="text-clamp1 mx-[1.2rem] mt-[0.8rem] mb-[1.2rem]">
						{postDetail?.content}
					</p>
				</div>
				{session?.user?.user_id === postDetail?.user_id ||
				session?.user?.role === "admin" ? (
					<div className="flex justify-evenly mb-[0.8rem]">
						{/* onclick link to post[id] params */}
						<div className="flex relative items-center mb-[0.8rem] group">
							<button
								title="edit post"
								onClick={() => modifBtn()}
								onAnimationEnd={() => setModifyBtnEffect(false)}
								className={`bg-appstone text-[1.4rem] text-white w-[3rem] h-[2.8rem] rounded-tl-[15px] rounded-br-[15px] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
									modifyBtnEffect && "animate-bgSize"
								}`}>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						</div>
						<div className="flex items-center mb-[0.8rem]">
							<button
								title="delete post"
								onClick={() => handleDelete(post.id)}
								onAnimationEnd={() => setDeleteBtnEffect(false)}
								className={`bg-appred text-[1.4rem] text-white w-[3rem] h-[2.8rem] rounded-tl-[1.5rem] rounded-br-[1.5rem] mt-[0.8rem] mb-[0.8rem] transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:text-appblck hover:translate-y-[7px] hover:shadow-btnlred bg-[linear-gradient(#ca2401,#ca2401)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
									deleteBtnEffect && "animate-bgSize"
								}`}>
								<FontAwesomeIcon icon={faTrashCan} />
							</button>
						</div>
					</div>
				) : (
					<div></div>
				)}
				<div className="flex justify-between items-center">
					<PostLiking post={postDetail} session={session} />

					{/* add comment*/}
					<div className="mr-[4.8rem] relative">
						<span className="text-clamp2 mr-[0.4rem]">
							{postDetail?.discussions}
						</span>
						<button
							title="add a comment"
							onClick={() => addComment()}
							onAnimationEnd={() => setCommentEffect(false)}
							className={`cursor-pointer hover:opacity-50 ${
								commentEffect && "animate-resizeBtn"
							}`}>
							<FontAwesomeIcon
								icon={faComments}
								style={{ color: "#2ECEC2" }}
								size="xl"
							/>
							<FontAwesomeIcon
								icon={faPlus}
								style={{ color: "#ff20c9" }}
								className={`absolute left-[2.6rem] bottom-[0.9rem] drop-shadow-lighter ${
									commentEffect && "opacity-0"
								} `}
							/>
						</button>
					</div>

					{/* share post */}
					<div
						className={`mr-[1.6rem] hover:opacity-60 ${
							shareEffect && "animate-resizeBtn"
						}`}
						onAnimationEnd={() => setShareEffect(false)}>
						<button
							title="share post"
							onClick={() => handleShare()}>
							<FontAwesomeIcon
								icon={faShareFromSquare}
								style={{ color: "#7953be" }}
								size="xl"
							/>
						</button>
					</div>
				</div>
			</section>
			<div>
				<nav
					onClick={() => backToLast()}
					onAnimationEnd={() => setBackBtnEffect(false)}
					className="flex justify-center my-[1.6rem]">
					<a
						title="back to post"
						href={`/?page=${pg}#${postDetail?.id}`}
						as={`/#${postDetail?.id}`}
						className={`bg-[#FF7900] text-appblck rounded-xl flex justify-center items-center w-[3.6rem] h-[3.6rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px] hover:shadow-btnorange m-0 shadow-neatcard ${
							backBtnEffect && "animate-pressDown bg-apppastgreen"
						}`}>
						<FontAwesomeIcon icon={faLeftLong} size="2xl" />
					</a>
				</nav>
			</div>

			{/* new comment form overlay */}
			<AnimatePresence>
				{newComment && (
					<CommentAdd
						post={post}
						setPost={setPostDetail}
						setAllComms={setCommentsDetail}
						setAddComm={setNewComment}
					/>
				)}
			</AnimatePresence>

			{/* comments */}
			<section
				className={
					commentsDetail.length > 0
						? "bg-appstone py-[1.6rem]"
						: "py-[0.4rem]"
				}>
				{commentsDetail.length > 0 ? (
					commentsDetail?.map((comment, index) => (
						<article
							key={comment.id}
							className="flex flex-col border-2 w-[94%] mx-auto my-[0.4rem] rounded-xl px-[1.2rem] py-[0.4rem] bg-white">
							{/* comment user pic zoom overlay */}
							{clickedBtn === index && userComPicZoom ? (
								<div
									className="fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block"
									onClick={() => hideUsrPicComZoomOverlay()}>
									<Image
										width={0}
										height={0}
										priority={true}
										src={comment.user.picture}
										alt={`${comment.user.username} picture`}
										placeholder="empty"
										className="block m-auto w-[96%] h-auto object-cover my-[4.8rem] rounded-lg animate-rotateZoom"
									/>
								</div>
							) : (
								<div></div>
							)}
							{clickedBtn === index && commentImgZoom ? (
								<div
									className="fixed overflow-y-scroll left-0 right-0 top-0 bottom-0 w-full h-full bg-appblck z-[998] block"
									onClick={() => hideCommImgZoomOverlay()}>
									<Image
										width={0}
										height={0}
										priority={true}
										src={comment.image}
										alt={`${comment.user.username}'s zoomed comment image`}
										placeholder="empty"
										className="block m-auto w-[96%] h-auto object-cover my-[4.8rem] rounded-lg animate-resizeZoom"
									/>
								</div>
							) : (
								<div></div>
							)}

							<div className="flex justify-between">
								<div className="flex justify-start">
									<div
										className="rounded-full mr-[0.4rem] border-[1px] border-gray-300 cursor-pointer transition-all duration-300 ease-in-out delay-75 hover:scale-105 hover:bg-apppink hover:drop-shadow-light w-[2.4rem] h-[2.4rem]"
										onClick={() => {
											setClickedBtn(index);
											showUsrPicComZoomOverlay();
										}}>
										<Image
											width={0}
											height={0}
											placeholder="empty"
											className="rounded-full object-cover w-full h-full cursor-pointer"
											src={comment.user.picture}
											alt={`${comment.user.username} picture`}
										/>
									</div>
									{session?.user.user_id ===
									comment.user_id ? (
										<div>
											<p className="text-clamp2">You</p>
										</div>
									) : (
										<nav
											className={`text-clamp2 hover:text-appturq active:text-appturq focus:text-appturq ${
												clickedBtn === index &&
												usrLinkEffect &&
												"animate-resizeBtn"
											}`}
											onClick={() => {
												setClickedBtn(index);
												setUsrLinkEffect(true);
												setUpdCommentCard(false);
											}}
											onAnimationEnd={() =>
												setUsrLinkEffect(false)
											}>
											<a
												href={`/csian/${[
													postDetail.user_id,
												]}?page=${pg}`}
												as={`/csian/${[
													postDetail.user_id,
												]}`}>
												{comment.user.username}
											</a>
										</nav>
									)}
								</div>
								<div className="flex justify-around">
									<CommentLiking
										post={post}
										comment={comment}
										errorMsg={setErrMsg}
									/>
								</div>
							</div>
							<div className="text-clamp6 mt-[0.8rem] mb-[0.4rem]">
								<p>{comment.message}</p>
							</div>

							{comment.image ? (
								<div
									className="flex items-center justify-end w-[54%] h-[11.2rem] self-center my-[0.8rem] rounded-lg shadow-card"
									onClick={() => {
										setClickedBtn(index);
										showCommImgZoomOverlay();
									}}>
									<Image
										width={0}
										height={0}
										src={comment.image}
										alt="comment image"
										placeholder="empty"
										className="rounded-lg object-cover w-full h-full cursor-pointer"
									/>
								</div>
							) : (
								<div></div>
							)}

							<div className="flex text-clamp2 font-extralight justify-between ml-[4rem] mt-[0.8rem]">
								{session?.user.user_id === comment.user_id ||
								session?.user.role === "admin" ? (
									<div className="">
										<button
											title={
												clickedBtn === index &&
												updCommentCard
													? "cancel update"
													: "edit"
											}
											onClick={() => {
												setClickedBtn(index);
												commentUpdBtn();
											}}
											onAnimationEnd={() =>
												setUpdCommentBtnEffect(false)
											}
											className={`mx-[1.2rem] hover:opacity-60 ${
												clickedBtn === index &&
												updCommentBtnEffect &&
												"animate-resizeBtn"
											}`}>
											{clickedBtn === index &&
											updCommentCard ? (
												<FontAwesomeIcon
													icon={faXmark}
													style={{ color: "#F43F5E" }}
													size="lg"
												/>
											) : (
												<FontAwesomeIcon
													icon={faPenFancy}
													style={{ color: "#65A30D" }}
												/>
											)}
										</button>
										<button
											title="delete"
											onClick={() => {
												setClickedBtn(index);
												handleDeleteComment(comment.id);
											}}
											onAnimationEnd={() =>
												setDelCommentBtnEffect(false)
											}
											className={`mx-[1.2rem] hover:opacity-60 ${
												clickedBtn === index &&
												delCommentBtnEffect &&
												"animate-resizeBtn"
											}`}>
											<FontAwesomeIcon
												icon={faTrashCan}
												style={{ color: "#F43F5E" }}
											/>
										</button>
										<button
											onClick={() => {
												setClickedBtn(index);
												handleShareComment(comment.id);
											}}
											onAnimationEnd={() =>
												setShareCommentBtnEffect(false)
											}
											className={`mx-[1.2rem] hover:opacity-60 ${
												clickedBtn === index &&
												shareCommentBtnEffect &&
												"animate-resizeBtn"
											}`}>
											<FontAwesomeIcon
												icon={faShare}
												style={{ color: "#7953be" }}
											/>
										</button>
									</div>
								) : (
									<div>
										<button className="mx-[1.2rem] hover:opacity-60">
											<FontAwesomeIcon
												icon={faShare}
												style={{ color: "#7953be" }}
											/>
										</button>
									</div>
								)}
								<div>
									{comment.editedAt ? (
										comment.editedByAdmin ? (
											<p>
												Edited{" "}
												<span className="font-medium text-indigo-500">
													{" "}
													BY ADMIN
												</span>{" "}
												{dateParser2(comment.editedAt)}
											</p>
										) : (
											<p>
												Edited{" "}
												{dateParser2(comment.editedAt)}
											</p>
										)
									) : (
										<p>
											Added{" "}
											{dateParser2(comment.createdAt)}
										</p>
									)}
								</div>
							</div>
							<AnimatePresence>
								{clickedBtn === index && errMsg && (
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
							<AnimatePresence>
								{clickedBtn === index && updCommentCard && (
									<CommentUpdate
										post={post}
										comment={comment}
										setupdcomcard={setUpdCommentCard}
										setcomments={setCommentsDetail}
									/>
								)}
							</AnimatePresence>
						</article>
					))
				) : (
					<section>
						<p className="text-clamp6 text-center py-[2rem]">
							No comments
						</p>
					</section>
				)}
			</section>
		</>
	);
}

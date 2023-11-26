"use client";
import React, { useState } from "react";
import {
	FacebookShareButton,
	FacebookIcon,
	PinterestShareButton,
	PinterestIcon,
	RedditShareButton,
	RedditIcon,
	WhatsappShareButton,
	WhatsappIcon,
	LinkedinShareButton,
	LinkedinIcon,
	TwitterShareButton,
	TwitterIcon,
} from "next-share";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faXmark,
	faShareFromSquare,
	faShare,
} from "@fortawesome/free-solid-svg-icons";

export default function ShareLink({ post, comment }) {
	const path = usePathname();
	const [isShareShown, setIsShareShown] = useState(false);
	const [closeShareEffect, setCloseShareEffect] = useState(false);
	const [isBlurred, setIsBlurred] = useState(false);
	const [shareEffect, setShareEffect] = useState(false);
	//console.log("path : ", path);
	const handleShare = () => {
		setShareEffect(true);
		setTimeout(() => {
			setIsShareShown(true);
			document.getElementById("body-container").style.overflow = "hidden";
		}, 500);
		setTimeout(() => {
			setIsBlurred(true);
		}, 1300);
	};

	const handleClose = () => {
		setCloseShareEffect(true);
		setTimeout(() => {
			setIsBlurred(false);
		}, 390);
		setTimeout(() => {
			setIsShareShown(false);
			document.getElementById("body-container").style.overflow = "";
		}, 400);
	};

	return (
		<>
			{/* share button */}
			<div
				className={` ${
					comment
						? "mx-[1.2rem] hover:opacity-60"
						: "mr-[1.6rem] text-clamp2 hover:opacity-60"
				} ${shareEffect && "animate-resizeBtn"}`}
				onAnimationEnd={() => setShareEffect(false)}>
				<button title="share post" onClick={() => handleShare()}>
					<FontAwesomeIcon
						icon={comment ? faShare : faShareFromSquare}
						style={{ color: "#7953be" }}
					/>
				</button>
			</div>

			{/* share pop segment */}
			<AnimatePresence>
				{isShareShown && (
					<motion.section
						key="share-card"
						initial={{ opacity: 0, y: 100, x: 100 }}
						animate={{ opacity: 1, y: 0, x: 0 }}
						exit={{ opacity: 0, y: 100, x: 100 }}
						transition={{ duration: 0.4, origin: 1, delay: 0.25 }}
						className={`z-[700] w-full top-0 left-0 h-full fixed overflow-auto ${
							isBlurred && "animate-pop"
						}`}>
						<div className="bg-appmauvelight absolute top-[9.6rem] left-[4.5%] p-3 w-[90%] min-h-[18rem] rounded-xl shadow-neatcard overflow-auto">
							<div className="flex justify-end">
								<FontAwesomeIcon
									icon={faXmark}
									size="2xl"
									onClick={() => handleClose()}
									onAnimationEnd={() =>
										setCloseShareEffect(false)
									}
									className={`cursor-pointer hover:text-appred mb-[1.2rem] ${
										closeShareEffect &&
										"animate-pressed opacity-60"
									}`}
								/>
							</div>

							<AnimatePresence>
								<motion.section
									key="share-links"
									layout
									initial={{ opacity: 0, x: -80 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{
										opacity: 0,
										x: -80,
										transition: {
											ease: "easeOut",
											duration: 0.4,
										},
									}}
									transition={{
										type: "spring",
										delay: 1,
									}}
									className="flex flex-col gap-[3rem] justify-center items-center">
									<h1 className="text-clamp3 uppercase font-semibold">
										Share this Link
									</h1>
									<div className="flex gap-x-[0.6rem]">
										<FacebookShareButton
											url={
												post
													? `http://localhost:3000/coms/${[
															post.id,
													  ]}`
													: comment
													? `http://localhost:3000${path}#${comment.id}`
													: `http://localhost:3000${path}`
											}>
											<FacebookIcon size={32} round />
										</FacebookShareButton>
										<PinterestShareButton
											url={
												post
													? `http://localhost:3000/coms/${[
															post.id,
													  ]}`
													: comment
													? `${path}#${comment.id}`
													: path
											}>
											<PinterestIcon size={32} round />
										</PinterestShareButton>
										<RedditShareButton
											url={
												post
													? `http://localhost:3000/coms/${[
															post.id,
													  ]}`
													: comment
													? `${path}#${comment.id}`
													: path
											}>
											<RedditIcon size={32} round />
										</RedditShareButton>
										<WhatsappShareButton
											url={
												post
													? `http://localhost:3000/coms/${[
															post.id,
													  ]}`
													: comment
													? `${path}#${comment.id}`
													: path
											}>
											<WhatsappIcon size={32} round />
										</WhatsappShareButton>
										<LinkedinShareButton
											url={
												post
													? `http://localhost:3000/coms/${[
															post.id,
													  ]}`
													: comment
													? `${path}#${comment.id}`
													: path
											}>
											<LinkedinIcon size={32} round />
										</LinkedinShareButton>
										<TwitterShareButton
											url={
												post
													? `http://localhost:3000/coms/${[
															post.id,
													  ]}`
													: comment
													? `${path}#${comment.id}`
													: path
											}>
											<TwitterIcon size={32} round />
										</TwitterShareButton>
									</div>
								</motion.section>
							</AnimatePresence>
						</div>
					</motion.section>
				)}
			</AnimatePresence>
		</>
	);
}

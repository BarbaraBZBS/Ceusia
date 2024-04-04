"use client";
import React, { useEffect, useState } from "react";
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
	TumblrShareButton,
	TumblrIcon,
} from "react-share";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faXmark,
	faShareFromSquare,
	faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FocusOn } from "react-focus-on";

export default function ShareLink({ post, comment }) {
	const path = usePathname();
	const [isShareShown, setIsShareShown] = useState(false);
	const [closeShareEffect, setCloseShareEffect] = useState(false);
	const [isBlurred, setIsBlurred] = useState(false);
	const [shareEffect, setShareEffect] = useState(false);
	//console.log("path : ", path);

	//show share card function
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

	//hide share card function
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
				className={`flex items-center ${
					comment
						? "mx-[1.2rem] hover:opacity-60"
						: "mr-[1.6rem] text-clamp2 hover:opacity-60"
				} ${shareEffect && "animate-resizeBtn"}`}
				onAnimationEnd={() => setShareEffect(false)}>
				<button title="Share" onClick={() => handleShare()}>
					<FontAwesomeIcon
						icon={comment ? faShare : faShareFromSquare}
						className="text-appmauvedark dark:text-apppastgreen"
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
						className={`z-[700] w-screen top-0 left-0 h-full fixed overflow-hidden ${
							isBlurred && "animate-pop"
						}`}>
						<FocusOn
							onClickOutside={() => handleClose()}
							onEscapeKey={() => handleClose()}>
							<div
								role="dialog"
								aria-labelledby="share-ttl"
								className="bg-appmauvelight dark:bg-applightdark absolute top-[7.6rem] left-[calc(50vw-(90vw/2))] p-3 w-[90vw] sm:w-[60vw] sm:left-[calc(50vw-(60vw/2))] lg:w-[40vw] lg:left-[calc(50vw-(40vw/2))] min-h-[18rem] rounded-xl shadow-neatcard">
								<div className="flex justify-end mb-[1.2rem]">
									<button
										aria-label="close share"
										onClick={() => handleClose()}>
										<FontAwesomeIcon
											icon={faXmark}
											size="2xl"
											onAnimationEnd={() =>
												setCloseShareEffect(false)
											}
											className={`w-[1.5rem] h-[2rem] cursor-pointer hover:text-appred ${
												closeShareEffect &&
												"animate-pressed opacity-60"
											}`}
										/>
									</button>
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
										className="flex flex-col gap-[3rem] justify-center items-center overflow-hidden w-full">
										<h1
											id="share-ttl"
											className="text-clamp8 mob88:text-clamp7 uppercase font-semibold">
											Share this Link
										</h1>
										<div className="flex gap-x-[0.6rem] mob00:gap-x-[0.2rem]">
											<FacebookShareButton
												className="rounded-full"
												aria-label="facebook share"
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
											{/* pinterest throwing error */}
											<PinterestShareButton
												className="rounded-full"
												aria-label="pinterest share"
												url={
													post
														? `http://localhost:3000/coms/${[
																post.id,
														  ]}`
														: comment
														? `${path}#${comment.id}`
														: path
												}>
												<PinterestIcon
													size={32}
													round
												/>
											</PinterestShareButton>
											<RedditShareButton
												className="rounded-full"
												aria-label="reddit share"
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
												className="rounded-full"
												aria-label="whatsapp share"
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
												className="rounded-full"
												aria-label="linkedin share"
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
												className="rounded-full"
												aria-label="twitter share"
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
											<TumblrShareButton
												className="rounded-full"
												aria-label="tumblr share"
												url={
													post
														? `http://localhost:3000/coms/${[
																post.id,
														  ]}`
														: comment
														? `${path}#${comment.id}`
														: path
												}>
												<TumblrIcon size={32} round />
											</TumblrShareButton>
										</div>
									</motion.section>
								</AnimatePresence>
							</div>
						</FocusOn>
					</motion.section>
				)}
			</AnimatePresence>
		</>
	);
}

"use client";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { FaBell } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { CgFeed } from "react-icons/cg";
import { BiSolidMessageRounded } from "react-icons/bi";
import { RiUserFollowFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Notifications() {
	const axiosAuth = useAxiosAuth();
	const path = usePathname();
	const { data: session } = useSession();
	const {
		notifications,
		markAllAsRead,
		contacts,
		markAsRead,
		markPostNotifAsRead,
		isDesiredChat,
	} = useContext(ChatContext);
	const [unread, setUnread] = useState([]);
	const [markEffect, setMarkEffect] = useState(false);
	const [notificationsEffect, setNotificationsEffect] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [improvedNotifications, setImprovedNotifications] = useState([]);
	const [goToChatEffect, setGoToChatEffect] = useState(false);
	const [goToUserEffect, setGoToUserEffect] = useState(false);
	const [isBtnClicked, setIsBtnClicked] = useState(false);
	const isDisabled = unread?.length === 0;

	useEffect(() => {
		const modifyNotifications = async () => {
			if (notifications) {
				let array = [];
				for (let not of notifications) {
					const res = await axiosAuth.get(
						`/auth/user/${not.sender_id}`
					);
					const notify = {
						...not,
						senderName: res?.data?.username,
					};
					array.push(notify);
				}
				setImprovedNotifications(array);
			}
		};
		modifyNotifications();
	}, [notifications, axiosAuth]);

	useEffect(() => {
		const unreadNotifications = () => {
			if (notifications) {
				const toRead = notifications.filter((n) => n.isRead === false);
				setUnread(toRead);
			}
		};
		unreadNotifications();
	}, [notifications, session]);

	const handleNotification = (n) => {
		console.log("notif chat : ", n);
		setGoToChatEffect(true);
		setTimeout(() => {
			markAsRead(n, notifications, contacts);
			setIsNotificationsOpen(false);
		}, 500);
	};

	const handlePostNotification = (n) => {
		console.log("notif post : ", n);
		setGoToChatEffect(true);
		setTimeout(() => {
			markPostNotifAsRead(n, notifications);
			setIsNotificationsOpen(false);
		}, 500);
	};

	const handleFollowNotification = (n) => {
		console.log("notif follow : ", n);
		setGoToUserEffect(true);
		setTimeout(() => {
			markPostNotifAsRead(n, notifications);
			setIsNotificationsOpen(false);
		}, 500);
	};

	const handleMark = () => {
		setMarkEffect(true);
		markAllAsRead(notifications);
	};

	return (
		<>
			<button
				title={
					isNotificationsOpen
						? "Close Notifications"
						: "Show Notifications"
				}
				className="ml-[1.5rem] max-[292px]:ml-[0.5rem] sm:ml-[2rem] lg:ml-[4rem] cursor-pointer relative hover:drop-shadow-light"
				onClick={() => {
					setNotificationsEffect(true);
					setIsNotificationsOpen(!isNotificationsOpen);
				}}>
				<FaBell
					aria-label="Manage notifications"
					className={`w-[2.5rem] h-[2.5rem] sm:w-[2.8rem] sm:h-[2.8rem] mob88:w-[1.8rem] mob88:h-[1.8rem] text-white drop-shadow-linkTxt dark:hover:opacity-80 transform-gpu ${
						notificationsEffect &&
						"animate-pressed text-apppinklight"
					}`}
					onAnimationEnd={() => setNotificationsEffect(false)}
				/>
				<div
					className={
						unread?.length === 0
							? ""
							: "flex w-[1.8rem] h-[1.8rem] mob88:h-[1.5rem] mob88:w-[1.5rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.2rem] font-semibold absolute top-[-0.5rem] right-[-0.5rem]"
					}>
					{unread?.length === 0 ? null : (
						<>
							<span
								aria-label={`${unread?.length} notifications`}
								className="sr-only"></span>
							<span aria-hidden>{unread?.length}</span>
						</>
					)}
				</div>
			</button>
			<AnimatePresence>
				{isNotificationsOpen ? (
					<motion.section
						key="notifications-card"
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ duration: 0.4, origin: 1, delay: 0.25 }}
						className="z-[300] bg-gray-200 dark:bg-applightdark absolute top-[6.5rem] mob88:top-[5.1rem] left-[45%] p-3 w-[50%] lg:w-[30%] rounded-xl mob88:text-clamp2 shadow-neatcard overflow-auto">
						<div className="flex flex-col text-center">
							<div className="py-[1rem] flex flex-col justify-center items-center">
								<h1 className="text-clamp1 mob88:text-[1.2rem]  font-medium uppercase mb-[0.8rem]">
									Notifications
								</h1>
								<button
									aria-disabled={isDisabled}
									className={`flex items-center mob88:text-[1rem]  opacity-85 border-2 border-transparent bg-gray-300 dark:bg-gray-600 rounded-2xl w-fit px-[0.6rem] ${
										markEffect && "animate-clicked"
									} ${
										isDisabled
											? "bg-opacity-40 text-gray-400 cursor-not-allowed"
											: "hover:bg-apppastgreen"
									}`}
									onClick={(e) => {
										isDisabled
											? e.preventDefault()
											: handleMark();
									}}
									onAnimationEnd={() => setMarkEffect(false)}>
									Mark all as read
								</button>
							</div>
							{improvedNotifications?.length === 0 ? (
								<span className="border-t-gray-700 dark:border-t-gray-500 border-t-[0.1rem] mob88:text-[1rem] ">
									No notifications
								</span>
							) : null}
							{improvedNotifications &&
								improvedNotifications.map(
									(notification, index) => {
										return (
											<div
												key={index}
												className={`${
													notification.isRead
														? "font-light mob88:text-[1rem] border-b-gray-700 dark:border-b-gray-400 border-b-[0.1rem] my-[0.5rem]"
														: "font-medium mob88:text-[1rem] border-b-gray-700 dark:border-b-gray-400 border-b-[0.1rem] my-[0.5rem] bg-gray-300 dark:bg-appstone"
												}
												${isBtnClicked === index && goToChatEffect && "animate-pressed"}
												${isBtnClicked === index && goToUserEffect && "animate-pressed"}`}
												onClick={() => {
													setIsBtnClicked(index);
													if (
														!notification.post_id &&
														!notification.followed
													) {
														handleNotification(
															notification
														);
													}
													if (
														notification.followed &&
														!notification.post_id
													) {
														handleFollowNotification(
															notification
														);
													}
													if (notification.post_id) {
														handlePostNotification(
															notification
														);
													}
												}}
												onAnimationEnd={() => {
													if (notification.followed) {
														setGoToUserEffect(
															false
														);
													}
													if (
														!notification.followed
													) {
														setGoToChatEffect(
															false
														);
													}
												}}>
												<a
													aria-describedby="notif"
													aria-label={
														notification.isRead
															? "notification"
															: "unread notification"
													}
													href={
														notification.followed
															? `/csian/${[
																	notification.sender_id,
															  ]}`
															: notification.post_id &&
															  !notification.comment_id
															? `/coms/${notification.post_id}`
															: notification.post_id &&
															  notification.comment_id
															? `/coms/${notification.post_id}/#${notification.comment_id}`
															: !notification.post_id &&
															  !notification.comment_id &&
															  path !== "/chat"
															? `/chat?callbackUrl=${isDesiredChat?.id}`
															: "/chat"
													}
													className="block">
													<div className="flex justify-center items-center gap-[1rem] max-w-[80%] mx-auto mob48:max-w-[96%] lg:gap-[3rem] lg:justify-start lg:max-w-[90%]">
														{notification.post_id &&
														notification.comment_id ? (
															<div>
																<FaComments className="ml-[0.3rem] w-[1.8rem] h-[1.8rem] lg:w-[2.5rem] lg:h-[2.5rem] text-white drop-shadow-linkTxt" />
															</div>
														) : notification.post_id &&
														  !notification.comment_id ? (
															<div>
																<CgFeed className="ml-[0.3rem] w-[1.8rem] h-[1.8rem] lg:w-[2.5rem] lg:h-[2.5rem] text-white drop-shadow-linkTxt" />
															</div>
														) : !notification.post_id &&
														  !notification.comment_id &&
														  notification.followed ? (
															<div>
																<RiUserFollowFill className="ml-[0.3rem] w-[1.8rem] h-[1.8rem] lg:w-[2.5rem] lg:h-[2.5rem] text-white drop-shadow-linkTxt" />
															</div>
														) : (
															<div>
																<BiSolidMessageRounded className="w-[1.8rem] h-[1.8rem] lg:w-[2.5rem] lg:h-[2.5rem] text-white drop-shadow-linkTxt" />
															</div>
														)}
														<div id="notif">
															{notification.liked ? (
																<span>{`${notification.senderName} liked your post`}</span>
															) : notification.disliked ? (
																<span>{`${notification.senderName} disliked your post`}</span>
															) : notification.commentLiked ? (
																<span>{`${notification.senderName} liked your comment`}</span>
															) : notification.commentDisliked ? (
																<span>{`${notification.senderName} disliked your comment`}</span>
															) : notification.comment_id ? (
																<span>{`${notification.senderName} commented your post`}</span>
															) : notification.followed ? (
																<span>{`${notification.senderName} followed you`}</span>
															) : (
																<span>{`${notification.senderName} sent a message`}</span>
															)}
															<br />
															<span className="mt-[0.2rem] opacity-70">
																{moment(
																	notification.date
																).calendar()}
															</span>
														</div>
													</div>
												</a>
											</div>
										);
									}
								)}
						</div>
					</motion.section>
				) : null}
			</AnimatePresence>
		</>
	);
}

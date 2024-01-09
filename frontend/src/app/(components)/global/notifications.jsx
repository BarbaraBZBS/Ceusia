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
	const [notificationsEffect, setNotificationsEffect] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [improvedNotifications, setImprovedNotifications] = useState([]);
	const [goToChatEffect, setGoToChatEffect] = useState(false);
	const [goToUserEffect, setGoToUserEffect] = useState(false);
	const [isBtnClicked, setIsBtnClicked] = useState(false);

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

	return (
		<>
			<div
				title="Notifications"
				className="ml-[1.5rem] cursor-pointer relative hover:drop-shadow-light"
				onClick={() => {
					setNotificationsEffect(true);
					setIsNotificationsOpen(!isNotificationsOpen);
				}}>
				<FaBell
					className={`w-[2.5rem] h-[2.5rem] text-white drop-shadow-linkTxt ${
						notificationsEffect &&
						"animate-pressed text-apppinklight"
					}`}
					onAnimationEnd={() => setNotificationsEffect(false)}
				/>
				<div
					className={
						unread?.length === 0
							? ""
							: "flex w-[1.8rem] h-[1.8rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.2rem] font-semibold absolute top-[-0.5rem] right-[-0.5rem]"
					}>
					{unread?.length === 0 ? null : (
						<span>{unread?.length}</span>
					)}
				</div>
			</div>
			<AnimatePresence>
				{isNotificationsOpen ? (
					<motion.div
						key="notifications-card"
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ duration: 0.4, origin: 1, delay: 0.25 }}
						className="z-[300] bg-gray-200 absolute top-[6.5rem] left-[45%] p-3 w-[50%] rounded-xl shadow-neatcard overflow-auto">
						<div className="flex flex-col text-clamp2 text-center">
							<div className="py-[1rem]">
								<h1 className="text-clamp1 font-medium uppercase">
									Notifications
								</h1>
								<div
									className="cursor-pointer opacity-80"
									onClick={() =>
										markAllAsRead(notifications)
									}>
									Mark all as read
								</div>
							</div>
							{improvedNotifications?.length === 0 ? (
								<span className="border-b-gray-700 border-b-[0.1rem]">
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
														? "font-light border-b-gray-700 border-b-[0.1rem] my-[0.5rem]"
														: "font-medium border-b-gray-700 border-b-[0.1rem] bg-gray-300 my-[0.5rem]"
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
													}>
													<div className="flex justify-center items-center gap-[1rem] max-w-[80%] mx-auto">
														{notification.post_id &&
														notification.comment_id ? (
															<div>
																<FaComments className="ml-[0.3rem] w-[1.8rem] h-[1.8rem] text-white drop-shadow-linkTxt" />
															</div>
														) : notification.post_id &&
														  !notification.comment_id ? (
															<div>
																<CgFeed className="ml-[0.3rem] w-[1.8rem] h-[1.8rem] text-white drop-shadow-linkTxt" />
															</div>
														) : !notification.post_id &&
														  !notification.comment_id &&
														  notification.followed ? (
															<div>
																<RiUserFollowFill className="ml-[0.3rem] w-[1.8rem] h-[1.8rem] text-white drop-shadow-linkTxt" />
															</div>
														) : (
															<div>
																<BiSolidMessageRounded className="w-[1.8rem] h-[1.8rem] text-white drop-shadow-linkTxt" />
															</div>
														)}
														<div>
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
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
}

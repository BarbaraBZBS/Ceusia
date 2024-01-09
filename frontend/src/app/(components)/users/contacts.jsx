"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "@/app/(utils)/axios";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import Image from "next/image";
import Loading from "../loading";
import { ChatContext } from "../ChatContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function Contacts({
	session,
	changeChat,
	selectedUser,
	setSelectedUser,
}) {
	const axiosAuth = useAxiosAuth();
	const searchParams = useSearchParams();
	const router = useRouter();
	const cbu = searchParams.get("callbackUrl");
	const [isLoading, setIsLoading] = useState(true);
	const [readBtnEffect, setReadBtnEffect] = useState(false);
	const {
		onlineUsers,
		contacts,
		setContacts,
		notifications,
		markUserAllAsRead,
		isDesiredChat,
	} = useContext(ChatContext);
	const [unread, setUnread] = useState([]);
	console.log("users on : ", onlineUsers);

	useEffect(() => {
		let followers = [];
		let userContacts = [];
		const getContacts = async () => {
			if (session) {
				const res = await axios.get(
					`/auth/user/${session.user.user_id}/followers`
				);
				if (res.data.count !== 0) {
					for (let row of res.data.rows) {
						followers.push(row.follower_id);
					}
				}
				const resp = await axios.get(
					`/auth/user/${session.user.user_id}/following`
				);
				if (resp.data.count !== 0) {
					const usersToSort = [];
					for (let row of resp.data.rows) {
						if (followers.includes(row.user_id)) {
							const response = await axiosAuth.get(
								`/auth/user/${row.user_id}`
							);
							usersToSort.push(response.data);
						}
					}
					userContacts = usersToSort.sort((a, b) =>
						a.username.localeCompare(b.username)
					);
				}
				setContacts(userContacts);
			}
		};
		getContacts();
		setIsLoading(false);
	}, [axiosAuth, session, setContacts]);

	const changeCurrentChat = (contact, index) => {
		setSelectedUser(index);
		changeChat(contact);
		console.log("contact : ", contact);
	};

	useEffect(() => {
		if (cbu) {
			changeChat(isDesiredChat);
			setTimeout(() => {
				router.push("/chat");
			}, 100);
		}
	}, [cbu, isDesiredChat, changeChat, router]);

	useEffect(() => {
		const unreadNotifications = () => {
			if (notifications) {
				const toRead = notifications.filter((n) => n.isRead === false);
				setUnread(toRead);
			}
		};
		unreadNotifications();
	}, [notifications]);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : session && contacts.length > 0 ? (
				<div className="grid grid-rows-[10%_78%_12%] overflow-hidden bg-appmauvedark rounded-tl-xl rounded-bl-xl shadow-lightinner">
					<div
						className="flex items-center justify-center gap-[0.5rem]"
						onClick={() => {
							if (selectedUser) setSelectedUser(undefined);
							changeChat(undefined);
						}}>
						<h1 className="text-clamp8 uppercase font-semibold text-white drop-shadow-light">
							Chat
						</h1>
					</div>
					<div className="flex flex-col items-center overflow-auto gap-[0.4rem]">
						{contacts.map((contact, index) => {
							const userUnread = unread?.filter(
								(un) => un.sender_id === contact.id
							);

							return (
								<div
									key={contact.id}
									className={`relative flex min-h-[5rem] w-[95%] cursor-pointer rounded-[4px] p-[0.2rem] gap-[0.7rem] items-center text-clamp6 shadow-neatcard truncate transition-all duration-500 ease-in-out ${
										selectedUser === index
											? "bg-apppastgreen text-appmauvedark drop-shadow-light"
											: "bg-apppinklighter text-appmauvedark"
									}`}
									onClick={() => {
										changeCurrentChat(contact, index);
										if (userUnread?.length !== 0) {
											markUserAllAsRead(
												userUnread,
												notifications
											);
										}
									}}>
									<Image
										width={0}
										height={0}
										placeholder="empty"
										alt="contact picture"
										src={contact.picture}
										className="rounded-full border-[0.15rem] border-t-appmauvedark border-r-appmauvedark border-b-apppink border-l-apppink object-cover w-[2.2rem] aspect-square"
									/>
									<p
										className={`truncate font-semibold ${
											selectedUser === index &&
											"drop-shadow-lighter"
										}`}>
										{contact.username}
									</p>
									{/* online indicator */}
									<div
										className={`inline-block h-[1.2rem] w-[1.2rem] rounded-[50%] absolute z-[2] top-[3.1rem] left-[1.95rem] ${
											onlineUsers?.some(
												(user) =>
													user?.userId === contact?.id
											)
												? "bg-[#0CDA0B]"
												: "bg-gray-500"
										}`}></div>
									<div
										className={
											userUnread?.length === 0
												? ""
												: "flex w-[2rem] h-[2rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.4rem] font-semibold absolute top-[0.3rem] right-[0.3rem]"
										}>
										{userUnread?.length === 0 ? null : (
											<span>{userUnread?.length}</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
					{/* unread single msg mark as read ?? */}
					{/*<div className="flex justify-center items-center gap-[2rem] text-clamp1 text-white font-semibold">
						<button
							className={`py-[0.3rem] px-[0.6rem] shadow-neatcard rounded-lg bg-yellow-500 hover:opacity-50 ${
								readBtnEffect && "animate-pressed"
							}`}
							onClick={() => {}}
							onAnimationEnd={() => setReadBtnEffect(false)}>
							Mark read
						</button>
					</div>*/}
				</div>
			) : (
				<div className="grid grid-rows-[13%_85%_2%] overflow-hidden bg-appmauvelight shadow-lightinner">
					<div className="flex items-center justify-center gap-[0.5rem]">
						<h1 className="text-clamp8 uppercase font-semibold text-white drop-shadow-light">
							Chat
						</h1>
					</div>
					<div className="flex flex-col items-center gap-[0.4rem] w-[92%]">
						<p className="text-center text-clamp6 m-[0.5rem]">
							Find new friends to chat first. Once you and another
							user follow each other, you can come back here to
							start messaging.
						</p>
					</div>
				</div>
			)}
		</>
	);
}

"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "@/app/(utils)/axios";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import Image from "next/image";
import Loading from "../loading";
import { ChatContext } from "../ChatContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

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
	const [logged, setLogged] = useState();
	const [loggedImgPath, setLoggedImgPath] = useState("");
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
	const isDisabled = selectedUser === undefined;
	const isMobile = useMediaQuery({ query: "(max-width: 639px)" });
	const isTabletOrBigger = useMediaQuery({ query: "(min-width: 640px)" });
	const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
	const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
	const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
	const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

	useEffect(() => {
		const getLogged = async () => {
			if (session) {
				const resp = await axiosAuth.get(
					`/auth/user/${session?.user?.user_id}`
				);
				console.log("logged user resp : ", resp);
				setLogged(resp.data);
			}
		};
		getLogged();
	}, [axiosAuth, session]);

	useEffect(() => {
		logged &&
			setLoggedImgPath(process.env.NEXT_PUBLIC_API + logged.picture);
	}, [logged]);

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
		//setIsLoading(false);
	}, [axiosAuth, session, setContacts]);

	useEffect(() => {
		contacts && logged && setIsLoading(false);
	}, [contacts, logged]);

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
			) : logged && contacts.length > 0 ? (
				<div className="sm:grid sm:grid-rows-[10%_75%_15%] lg:grid lg:grid-rows-[10%_72%_18%] overflow-hidden bg-appmauvedark dark:bg-appmauvedarker rounded-tl-xl rounded-bl-xl shadow-lightinner">
					{isMobile && (
						<>
							<div className="flex justify-between h-full">
								<div className="flex flex-col items-center justify-between w-[35%] py-[0.6rem]">
									<button
										title={
											isDisabled
												? "No contact selected"
												: "reset chat contact selection"
										}
										aria-disabled={isDisabled}
										className={`flex items-center justify-center gap-[0.5rem] text-clamp3 max-[383px]:text-clamp7 uppercase font-semibold text-white drop-shadow-light ${
											isDisabled
												? "cursor-not-allowed opacity-50"
												: "hover:text-gray-300"
										}`}
										onClick={(e) => {
											if (isDisabled) {
												e.preventDefault();
											} else {
												setSelectedUser(undefined);
												changeChat(undefined);
											}
										}}>
										Chat
									</button>
									{/* logged user info */}
									<div className="flex flex-col justify-center items-center gap-[1.2rem] w-full">
										<Image
											src={loggedImgPath}
											alt={`${logged?.username} picture`}
											placeholder="empty"
											width={0}
											height={0}
											className="w-[5rem] aspect-square object-cover rounded-full border-2 border-apppinklight drop-shadow-linkTxt"
										/>
										<p className="w-[97%] pl-[0.4rem] text-clamp8 max-[383px]:text-clamp7 uppercase text-apppastgreen drop-shadow-linkTxt text-ellipsis text-center overflow-hidden">
											{logged?.username}
										</p>
									</div>
								</div>

								<div className="flex flex-col items-center overflow-auto gap-[0.4rem] w-[60%] py-[0.6rem]">
									{contacts.map((contact, index) => {
										const userUnread = unread?.filter(
											(un) => un.sender_id === contact.id
										);
										const contactImgPath =
											process.env.NEXT_PUBLIC_API +
											contact.picture;
										return (
											<div
												tabIndex={0}
												aria-label={`${
													selectedUser === index
														? `${contact.username} selected`
														: `select contact ${contact.username}`
												} ${
													onlineUsers?.some(
														(user) =>
															user?.userId ===
															contact?.id
													)
														? "online"
														: "offline"
												}`}
												key={contact.id}
												className={`relative flex justify-evenly min-h-[5rem] w-[95%] cursor-pointer rounded-[4px] p-[0.2rem] gap-[0.7rem] items-center text-clamp7 max-[383px]:text-clamp4 shadow-neatcard truncate transition-all duration-500 ease-in-out font-semibold ${
													selectedUser === index
														? "bg-apppastgreen text-appmauvedark dark:text-appmauvedarker drop-shadow-light"
														: "bg-apppinklighter dark:bg-appturq text-appmauvedark dark:text-appmauvedarker"
												}`}
												onClick={() => {
													changeCurrentChat(
														contact,
														index
													);
													if (
														userUnread?.length !== 0
													) {
														markUserAllAsRead(
															userUnread,
															notifications
														);
													}
												}}
												onKeyUp={(e) => {
													if (e.key === "Enter") {
														changeCurrentChat(
															contact,
															index
														);
														if (
															userUnread?.length !==
															0
														) {
															markUserAllAsRead(
																userUnread,
																notifications
															);
														}
													}
												}}>
												<div className="relative">
													<Image
														aria-description={`${
															selectedUser ===
															index
																? `${contact.username} selected`
																: `select contact ${contact.username}`
														} ${
															onlineUsers?.some(
																(user) =>
																	user?.userId ===
																	contact?.id
															)
																? "online"
																: "offline"
														}`}
														width={0}
														height={0}
														placeholder="empty"
														alt="contact picture"
														src={contactImgPath}
														className="rounded-full border-[0.15rem] border-t-appmauvedark border-r-appmauvedark border-b-apppink border-l-apppink object-cover w-[2.5rem] aspect-square"
													/>
													{/* online indicator */}
													<div
														className={`inline-block h-[1.2rem] w-[1.2rem] rounded-[50%] absolute z-[2] top-[1.7rem] left-[1.8rem] ${
															onlineUsers?.some(
																(user) =>
																	user?.userId ===
																	contact?.id
															)
																? "bg-[#0CDA0B]"
																: "bg-gray-500"
														}`}></div>
												</div>
												<p
													className={`truncate font-semibold ${
														selectedUser ===
															index &&
														"drop-shadow-lighter"
													}`}>
													{contact.username}
												</p>
												<div
													className={
														userUnread?.length === 0
															? ""
															: "flex w-[2rem] h-[2rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.4rem] font-semibold absolute top-[0.5rem] right-[84%]"
													}>
													{userUnread?.length ===
													0 ? null : (
														<span>
															{userUnread?.length}
														</span>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</>
					)}
					{isTabletOrBigger && (
						<>
							<button
								title={
									isDisabled
										? "No contact selected"
										: "reset chat contact selection"
								}
								aria-disabled={isDisabled}
								className={`flex items-center justify-center gap-[0.5rem] text-clamp8 uppercase font-semibold text-white drop-shadow-light ${
									isDisabled
										? "cursor-not-allowed opacity-50"
										: "hover:text-gray-300"
								}`}
								onClick={(e) => {
									if (isDisabled) {
										e.preventDefault();
									} else {
										setSelectedUser(undefined);
										changeChat(undefined);
									}
								}}>
								Chat
							</button>
							<div className="flex flex-col items-center overflow-auto gap-[0.4rem]">
								{contacts.map((contact, index) => {
									const userUnread = unread?.filter(
										(un) => un.sender_id === contact.id
									);
									const contactImgPath =
										process.env.NEXT_PUBLIC_API +
										contact.picture;
									return (
										<div
											tabIndex={0}
											aria-label={`${
												selectedUser === index
													? `${contact.username} selected`
													: `select contact ${contact.username}`
											} ${
												onlineUsers?.some(
													(user) =>
														user?.userId ===
														contact?.id
												)
													? "online"
													: "offline"
											}`}
											key={contact.id}
											className={`relative flex min-h-[5rem] w-[95%] cursor-pointer rounded-[4px] py-[0.2rem] px-[1rem] gap-[1.5rem] items-center text-clamp5 shadow-neatcard truncate transition-all duration-500 ease-in-out font-semibold ${
												selectedUser === index
													? "bg-apppastgreen text-appmauvedark dark:text-appmauvedarker drop-shadow-light"
													: "bg-apppinklighter dark:bg-appturq text-appmauvedark dark:text-appmauvedarker"
											}`}
											onClick={() => {
												changeCurrentChat(
													contact,
													index
												);
												if (userUnread?.length !== 0) {
													markUserAllAsRead(
														userUnread,
														notifications
													);
												}
											}}
											onKeyUp={(e) => {
												if (e.key === "Enter") {
													changeCurrentChat(
														contact,
														index
													);
													if (
														userUnread?.length !== 0
													) {
														markUserAllAsRead(
															userUnread,
															notifications
														);
													}
												}
											}}>
											<Image
												src={contactImgPath}
												alt="contact picture"
												aria-description={`${
													selectedUser === index
														? `${contact.username} selected`
														: `select contact ${contact.username}`
												} ${
													onlineUsers?.some(
														(user) =>
															user?.userId ===
															contact?.id
													)
														? "online"
														: "offline"
												}`}
												width={0}
												height={0}
												placeholder="empty"
												className="rounded-full border-[0.15rem] border-t-appmauvedark border-r-appmauvedark border-b-apppink border-l-apppink object-cover w-[3.5rem] aspect-square"
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
												className={`inline-block h-[1.3rem] w-[1.3rem] rounded-[50%] absolute z-[2] top-[3.1rem] left-[3.5rem] ${
													onlineUsers?.some(
														(user) =>
															user?.userId ===
															contact?.id
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
												{userUnread?.length ===
												0 ? null : (
													<span>
														{userUnread?.length}
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>
							{/* logged user info */}
							<div className="flex flex-col justify-center items-center gap-[1.2rem]">
								<Image
									src={loggedImgPath}
									alt={`${logged?.username} picture`}
									width={0}
									height={0}
									placeholder="empty"
									className="w-[5rem] aspect-square object-cover rounded-full border-2 border-apppinklight drop-shadow-linkTxt"
								/>
								<p className="max-w-[10.5rem] pl-[0.4rem] text-clamp8 uppercase text-apppastgreen drop-shadow-linkTxt text-ellipsis overflow-hidden">
									{logged?.username}
								</p>
							</div>
						</>
					)}{" "}
				</div>
			) : (
				<div className="sm:grid sm:grid-rows-[10%_78%_12%] overflow-hidden bg-appmauvelight shadow-lightinner">
					<div className="flex items-center justify-center gap-[0.5rem]">
						<h1
							aria-label="click to remove contact selection"
							className="text-clamp5 uppercase font-semibold text-white drop-shadow-light">
							Chat
						</h1>
					</div>
					<div className="flex flex-col items-center justify-center gap-[0.4rem] w-[92%] m-auto">
						<p className="text-center text-clamp6 m-[1rem]">
							Find new friends to chat first. Once you and another
							user follow each other, you can come back here to
							start messaging.
						</p>
					</div>
					<div className="flex flex-col justify-center items-center gap-[1.2rem]">
						<Image
							src={loggedImgPath}
							alt={`${logged?.username} picture`}
							width={0}
							height={0}
							placeholder="empty"
							className="w-[2rem] aspect-square object-cover rounded-full border-2 border-apppinklight drop-shadow-linkTxt"
						/>
						<p className="max-w-[10.5rem] pl-[0.4rem] text-clamp5 uppercase text-apppastgreen drop-shadow-linkTxt text-ellipsis overflow-hidden">
							{logged?.username}
						</p>
					</div>
				</div>
			)}
		</>
	);
}

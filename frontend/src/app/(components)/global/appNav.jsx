"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Logo from "../../../../public/images/logo.png";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/app/actions";
import { CgFeed } from "react-icons/cg";
import { BiSolidMessageRounded } from "react-icons/bi";
import { ChatContext } from "../ChatContext";
import Notifications from "./notifications";

export default function AppNav() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const cbu = searchParams.get("callbackUrl");
	const currentRoute = usePathname();
	const [profileEffect, setProfileEffect] = useState(false);
	const [logoutEffect, setLogoutEffect] = useState(false);
	const [signinEffect, setSigninEffect] = useState(false);
	const [registerEffect, setRegisterEffect] = useState(false);
	const [cancelLogoutEffect, setCancelLogoutEffect] = useState(false);
	const [threadLinkEffect, setThreadLinkEffect] = useState(false);
	const [chatLinkEffect, setChatLinkEffect] = useState(false);
	const { socket, setCurrentChat, notifications } = useContext(ChatContext);
	const [unreadAll, setUnreadAll] = useState([]);
	const [unreadChat, setUnreadChat] = useState([]);
	const [unreadPostsComments, setUnreadPostsComments] = useState([]);
	console.log("nav session: ", { session });

	useEffect(() => {
		if (currentRoute !== "/chat") {
			setCurrentChat(undefined);
		}
	});

	const goBackLink = () => {
		setCancelLogoutEffect(true);
		router.back();
	};

	useEffect(() => {
		let linkR;
		if (
			currentRoute !== "/" &&
			currentRoute !== "/auth/signIn" &&
			currentRoute !== "/auth/register" &&
			currentRoute !== "/about"
		) {
			linkR = currentRoute;
		}
		if (session && status !== "loading") {
			if (Date.now() >= Date.parse(session?.expires)) {
				logout();
				signOut({
					callbackUrl: cbu
						? `/auth/signIn?callbackUrl=${cbu}`
						: "/auth/signIn",
				});
			}
		} else if (status !== "loading" && !session) {
			if (
				currentRoute === "/" ||
				currentRoute === "/auth/signIn" ||
				currentRoute === "/auth/register" ||
				currentRoute === "/about"
			) {
				return;
			} else {
				logout();
				signOut({
					callbackUrl: linkR
						? `/auth/signIn?callbackUrl=${linkR}`
						: "/",
				});
			}
		}
	}, [session, currentRoute, status, cbu]);

	useEffect(() => {
		const unreadNotifications = () => {
			if (notifications) {
				const toReadAll = notifications.filter(
					(n) => n.isRead === false
				);
				setUnreadAll(toReadAll);

				const toReadChat = notifications.filter(
					(n) => !n.post_id && !n.followed && n.isRead === false
				);
				setUnreadChat(toReadChat);

				const toReadPostComm = notifications.filter(
					(n) => n.post_id && n.isRead === false
				);
				setUnreadPostsComments(toReadPostComm);
			}
		};
		unreadNotifications();
	}, [notifications]);
	//console.log("unread chat msgs : ", unreadChat);
	//console.log("unread posts and comments msgs : ", unreadPostsComments);

	return (
		<div className="mb-[0.8rem] text-clamp5 bg-gray-200 bg-opacity-60">
			<header className="flex flex-row justify-between">
				<nav>
					<a href="/" as={"/"}>
						<Image
							className="w-[17.6rem] h-[6.6rem] inline object-cover rounded-br-2xl"
							src={Logo}
							alt="ceusia main logo"
							width={0}
							height={0}
							priority={true}
							placeholder="empty"
							style={{ width: "17.6rem", height: "6.6rem" }}
						/>
					</a>
				</nav>
				<nav className="flex justify-center items-center ">
					{session?.user && (
						<>
							<div
								title="Posts"
								className="ml-[1.5rem] cursor-pointer relative hover:drop-shadow-light"
								onClick={() => setThreadLinkEffect(true)}>
								<a href="/thread" as={"/thread"}>
									<CgFeed
										className={`w-[2.5rem] h-[2.5rem] text-white drop-shadow-linkTxt ${
											threadLinkEffect &&
											"animate-pressed text-apppinklight"
										} ${
											currentRoute === "/thread" &&
											"text-sky-200"
										}`}
										onAnimationEnd={() =>
											setThreadLinkEffect(false)
										}
									/>
									<div
										className={
											unreadPostsComments?.length === 0
												? ""
												: "flex w-[1.8rem] h-[1.8rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.2rem] font-semibold absolute top-[-0.5rem] right-[-0.5rem]"
										}>
										{unreadPostsComments?.length ===
										0 ? null : (
											<span>
												{unreadPostsComments?.length}
											</span>
										)}
									</div>
								</a>
							</div>
							<div
								title="Chat"
								className="ml-[1.5rem] cursor-pointer relative hover:drop-shadow-light"
								onClick={() => setChatLinkEffect(true)}>
								<a href="/chat" as={"/chat"}>
									<BiSolidMessageRounded
										className={`w-[2.5rem] h-[2.5rem] text-white drop-shadow-linkTxt ${
											chatLinkEffect &&
											"animate-pressed text-apppinklight"
										} ${
											currentRoute === "/chat" &&
											"text-sky-200"
										}`}
										onAnimationEnd={() =>
											setChatLinkEffect(false)
										}
									/>
									<div
										className={
											unreadChat.length === 0
												? ""
												: "flex w-[1.8rem] h-[1.8rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.2rem] font-semibold absolute top-[-0.5rem] right-[-0.5rem]"
										}>
										{unreadChat?.length === 0 ? null : (
											<span>{unreadChat?.length}</span>
										)}
									</div>
								</a>
							</div>
							<Notifications />
						</>
					)}
				</nav>
				<nav className="flex flex-col justify-center mx-[1rem] text-center">
					{session?.user ? (
						<div className="flex flex-col">
							<div>
								{session?.user.role === "admin" ? (
									<div
										className={`${
											profileEffect && "animate-pressed"
										} ${
											currentRoute !== "/profile" &&
											"hover:translate-y-1 transition-all duration-200 ease-in-out"
										}`}
										onClick={() => setProfileEffect(true)}
										onAnimationEnd={() =>
											setProfileEffect(false)
										}>
										<a
											href="/profile"
											as={"/profile"}
											className={
												currentRoute === "/profile"
													? "text-red-700 drop-shadow-lighter underline"
													: "text-appred drop-shadow-lighter hover:text-appmauvelight active:text-appturq"
											}>
											{session?.user.username}
										</a>
									</div>
								) : (
									<div
										className={`${
											profileEffect && "animate-pressed"
										} ${
											currentRoute !== "/profile" &&
											"hover:translate-y-1 transition-all duration-200 ease-in-out"
										}`}
										onClick={() => setProfileEffect(true)}
										onAnimationEnd={() =>
											setProfileEffect(false)
										}>
										<a
											href="/profile"
											as={"/profile"}
											className={
												currentRoute === "/profile"
													? "text-appmagenta drop-shadow-lighter underline"
													: "text-appmauvedark drop-shadow-lighter hover:text-appmauvelight active:text-appturq"
											}>
											{session?.user.username}
										</a>
									</div>
								)}
							</div>
							{currentRoute === "/auth/signOut" ? (
								<button
									className={`hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out ${
										cancelLogoutEffect && "animate-pressed"
									}`}
									onClick={() => {
										goBackLink();
									}}
									onAnimationEnd={() =>
										setCancelLogoutEffect(false)
									}>
									Cancel
								</button>
							) : (
								<div
									className={`hover:translate-y-1 transition-all duration-200 ease-in-out ${
										logoutEffect && "animate-pressed"
									}`}
									onClick={() => {
										setLogoutEffect(true);
									}}
									onAnimationEnd={() =>
										setLogoutEffect(false)
									}>
									<a
										href={"/auth/signOut"}
										className="hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out">
										Sign Out
									</a>
								</div>
							)}
						</div>
					) : (
						<>
							<div
								className={`hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out ${
									signinEffect && "animate-pressed"
								} ${
									currentRoute === "/auth/signIn" &&
									"text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase"
								}`}
								onClick={() => setSigninEffect(true)}
								onAnimationEnd={() => setSigninEffect(false)}>
								<a
									href={
										cbu
											? `/auth/signIn?callbackUrl=${cbu}`
											: "/auth/signIn"
									}
									as={"/auth/signIn"}
									className={
										currentRoute === "/auth/signIn"
											? "hover:text-appturq hover:translate-y-1 active:text-appturq active:underline transition-all duration-200 ease-in-out text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase"
											: "hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out"
									}>
									Sign In
								</a>
							</div>
							<div
								className={`hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out ${
									registerEffect && "animate-pressed"
								} ${
									currentRoute === "/auth/register" &&
									"text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase"
								}`}
								onClick={() => setRegisterEffect(true)}
								onAnimationEnd={() => setRegisterEffect(false)}>
								<a
									href={
										cbu
											? `/auth/register?callbackUrl=${cbu}`
											: "/auth/register"
									}
									as={"/auth/register"}
									className={
										currentRoute === "/auth/register"
											? "hover:text-appturq hover:translate-y-1 active:text-appturq active:underline transition-all duration-200 ease-in-out text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase"
											: "hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out"
									}>
									Sign Up
								</a>
							</div>
						</>
					)}
				</nav>
			</header>
		</div>
	);
}

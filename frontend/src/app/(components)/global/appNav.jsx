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
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { BiPowerOff } from "react-icons/bi";
import { TiCancel } from "react-icons/ti";

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
	const { socket, setCurrentChat, notifications, newN, setNewN } =
		useContext(ChatContext);
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

	useEffect(() => {
		if (newN) {
			setTimeout(() => {
				setNewN(false);
			}, 3000);
		}
	}, [newN, setNewN]);

	return (
		<div className="mb-[0.8rem] w-screen text-clamp5 bg-gray-200 bg-opacity-60 dark:bg-appblck mob88:text-clamp7 max-[293px]:text-clamp1">
			<AnimatePresence>
				{newN && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ duration: 0.4, origin: 1, delay: 0.25 }}
						role="alert"
						aria-live="assertive"
						className="z-[400] absolute top-[6.6rem] left-[15%] w-[70%] bg-blue-300 dark:bg-appstone rounded-lg p-3 shadow-neatcard">
						<div className="flex justify-center text-center">
							<p className="text-clamp7 mob88:text-clamp2">
								You have a new notification <br />
								{unreadAll.length > 1
									? `${unreadAll.length} unread
						notifications`
									: `${unreadAll.length} unread notification`}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<header className="flex justify-between h-[6.6rem] mob88:h-[5rem] sm:h-[7.5rem]">
				<nav title="Go to Ceusia Home Page" className="flex">
					<a href="/" as={"/"} id="logo-link" className="block">
						<Image
							className="w-[17.6rem] h-[6.6rem] mob88:w-[12rem] mob88:h-full inline object-cover rounded-br-2xl sm:w-[21rem] sm:h-full lg:w-[23rem] lg:h-full"
							src={Logo}
							alt="ceusia main logo"
							aria-label="Navigate to Home Page"
							width={0}
							height={0}
							priority={true}
							placeholder="empty"
							//style={{ width: "17.6rem", height: "6.6rem" }}
						/>
					</a>
				</nav>
				<nav className="flex justify-center items-center mob48:px-[0.3rem]">
					{session?.user && (
						<>
							<div
								title="Go To Posts"
								className="ml-[1.5rem] max-[292px]:ml-[0.5rem] sm:ml-[2rem] lg:ml-[4rem] cursor-pointer relative hover:drop-shadow-light"
								onClick={() => setThreadLinkEffect(true)}>
								<a href="/thread" as={"/thread"}>
									<CgFeed
										aria-label="Navigate to Posts"
										className={`w-[2.5rem] h-[2.5rem] sm:w-[2.8rem] sm:h-[2.8rem] mob88:w-[1.8rem] mob88:h-[1.8rem] text-white drop-shadow-linkTxt dark:hover:opacity-80 transform-gpu ${
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
												: "flex w-[1.8rem] h-[1.8rem] mob88:w-[1.5rem] mob88:h-[1.5rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.2rem] font-semibold absolute top-[-0.5rem] right-[-0.5rem]"
										}>
										{unreadPostsComments?.length ===
										0 ? null : (
											<>
												<span
													aria-label={`${unreadPostsComments?.length} post notifications`}
													className="sr-only"></span>
												<span aria-hidden>
													{
														unreadPostsComments?.length
													}
												</span>
											</>
										)}
									</div>
								</a>
							</div>
							<div
								title="Go To Chat"
								className="ml-[1.5rem] max-[292px]:ml-[0.5rem] sm:ml-[2rem] lg:ml-[4rem] cursor-pointer relative hover:drop-shadow-light"
								onClick={() => setChatLinkEffect(true)}>
								<a href="/chat" as={"/chat"}>
									<BiSolidMessageRounded
										aria-label="Navigate to Chat"
										className={`w-[2.5rem] h-[2.5rem] sm:w-[2.8rem] sm:h-[2.8rem] mob88:w-[1.8rem] mob88:h-[1.8rem] text-white drop-shadow-linkTxt dark:hover:opacity-80 transform-gpu ${
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
										role="alert"
										aria-live="assertive"
										className={
											unreadChat.length === 0
												? ""
												: "flex w-[1.8rem] h-[1.8rem] mob88:w-[1.5rem] mob88:h-[1.5rem] justify-center items-center text-white bg-appred rounded-[50%] p-[0.5rem] text-[1.2rem] font-semibold absolute top-[-0.5rem] right-[-0.5rem]"
										}>
										{unreadChat?.length === 0 ? null : (
											<>
												<span
													//role="alert"
													//aria-live="assertive"
													aria-label={`${unreadChat?.length} chat notifications`}
													className="sr-only"></span>
												<span aria-hidden>
													{unreadChat?.length}
												</span>
											</>
										)}
									</div>
								</a>
							</div>
							<Notifications />
						</>
					)}
				</nav>
				<nav className="flex flex-col justify-center mx-[1rem] mob48:mx-0 text-center">
					{session?.user ? (
						<div className="flex flex-col">
							<div>
								{session?.user.role === "admin" ? (
									<div
										title={
											currentRoute === "/profile"
												? ""
												: "My Profile Page"
										}
										className={`m-[0.1rem] sm:mb-[0.5rem] text-ellipsis overflow-hidden ${
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
											aria-label={
												currentRoute === "/profile"
													? `${session?.user?.username}`
													: `Go To ${session?.user?.username} Profile Page`
											}
											href="/profile"
											as={"/profile"}
											className={`block text-ellipsis overflow-hidden m-[0.2rem] px-[0.3rem] max-w-[10rem] mob48:max-w-[90%] sm:max-w-[100%]
												${
													currentRoute === "/profile"
														? "text-red-700 drop-shadow-lighter underline mob88:mb-[0.5rem]"
														: "text-appred drop-shadow-lighter hover:text-appmauvelight active:text-appturq"
												}`}>
											{session?.user.username}
										</a>
									</div>
								) : (
									<div
										title={
											currentRoute === "/profile"
												? ""
												: "My Profile Page"
										}
										className={`m-[0.1rem] sm:mb-0 text-ellipsis overflow-hidden ${
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
											className={`block text-ellipsis overflow-hidden m-[0.2rem] px-[0.3rem] max-w-[10rem] mob48:max-w-[90%] sm:max-w-[100%]
												${
													currentRoute === "/profile"
														? "text-appmagenta dark:text-apppink drop-shadow-lighter underline"
														: "text-appmauvedark dark:text-apppastgreen drop-shadow-lighter hover:text-appmauvelight active:text-appturq dark:hover:text-appopred"
												}`}>
											{session?.user.username}
										</a>
									</div>
								)}
							</div>
							{currentRoute === "/auth/signOut" ? (
								<button
									title="cancel sign out"
									className={`flex justify-center items-center m-[0.2rem] text-appred hover:text-yellow-500 hover:translate-y-1 focus:text-appturq transition-all duration-200 ease-in-out ${
										cancelLogoutEffect && "animate-pressed"
									}`}
									onClick={() => {
										goBackLink();
									}}
									onAnimationEnd={() =>
										setCancelLogoutEffect(false)
									}>
									<TiCancel className="text-[2.5rem] mob88:text-[2.1rem]" />
								</button>
							) : (
								<div
									className={`w-fit m-auto hover:translate-y-1 transition-all duration-200 ease-in-out ${
										logoutEffect && "animate-pressed"
									}`}
									onClick={() => {
										setLogoutEffect(true);
									}}
									onAnimationEnd={() =>
										setLogoutEffect(false)
									}>
									<a
										title="sign out"
										href={"/auth/signOut"}
										className="flex justify-center py-[0.2rem] mob48:max-w-[90%] items-center text-appred hover:text-yellow-500 hover:translate-y-1 active:text-appturq focus:text-appturq transition-all duration-200 ease-in-out">
										<BiPowerOff className="text-[2.2rem] mob88:text-[1.8rem]" />
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

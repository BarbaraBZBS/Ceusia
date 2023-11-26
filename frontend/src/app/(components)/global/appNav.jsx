"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/app/actions";

export default function AppNav() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const currt = searchParams.get("currt");
	const currentRoute = usePathname();
	const [profileEffect, setProfileEffect] = useState(false);
	const [logoutEffect, setLogoutEffect] = useState(false);
	const [signinEffect, setSigninEffect] = useState(false);
	const [registerEffect, setRegisterEffect] = useState(false);
	const [cancelLogoutEffect, setCancelLogoutEffect] = useState(false);
	//console.log("router", router, currentRoute);
	console.log("nav session: ", { session });
	// console.log( 'expired? : ', session?.expires )

	const goBackLink = () => {
		setCancelLogoutEffect(true);
		router.back();
	};

	//useEffect(() => {
	//	let linkr = null;
	//	if (
	//		currentRoute !== "/" &&
	//		currentRoute !== "/auth/signIn" &&
	//		currentRoute !== "/auth/register" &&
	//		currentRoute !== "/about"
	//	) {
	//		linkr = currentRoute;
	//	}
	//	if (session && status !== "loading") {
	//		if (Date.now() >= Date.parse(session?.expires)) {
	//			logout();
	//			signOut({
	//				callbackUrl: "/auth/signIn",
	//			});
	//		}
	//	} else if (status !== "loading" && !session) {
	//		// if ( currentRoute !== '/auth/signIn' && currentRoute !== '/' && status !== 'loading' && !session ) {
	//		if (
	//			currentRoute === "/" ||
	//			currentRoute === "/auth/signIn" ||
	//			currentRoute === "/auth/register" ||
	//			currentRoute === "/about"
	//		) {
	//			return;
	//		} else {
	//			logout();
	//			signOut({
	//				callbackUrl: linkr ? `/auth/signIn?currt=${linkr}` : "/",
	//			});
	//		}
	//	}
	//}, [session, currentRoute, status]);

	return (
		<div className="mb-[0.8rem] text-clamp5 bg-gray-200 bg-opacity-60">
			<header className="flex flex-row justify-between">
				<nav>
					<a href="/" as={"/"}>
						<Image
							className="inline object-cover rounded-br-2xl"
							src="/images/logo.png"
							alt="ceusia main logo"
							width={176}
							height={66}
							priority={true}
							placeholder="empty"
							style={{ width: "17.6rem", height: "6.6rem" }}
						/>
					</a>
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
										currt
											? `/auth/signIn?currt=${currt}`
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
										currt
											? `/auth/register?currt=${currt}`
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

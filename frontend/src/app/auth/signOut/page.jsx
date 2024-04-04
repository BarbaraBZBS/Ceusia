"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { PageWrap } from "@/app/(components)/motions/pageWrap";
import Loading from "./loading";
import { logout } from "@/app/actions";

export default function SignOut() {
	const [isLoading, setIsLoading] = useState(false);
	const [logoutEffect, setLogoutEffect] = useState(false);

	//handle log out function
	const logUserOut = () => {
		setLogoutEffect(true);
		setTimeout(() => {
			setIsLoading(true);
			logout();
			signOut({ callbackUrl: "/" });
		}, 600);
	};

	return (
		<PageWrap>
			{isLoading ? (
				<Loading />
			) : (
				<section className="w-full h-[22.5rem] lg:h-[75vh] flex flex-col justify-center items-center">
					<h1 className="text-clamp8 my-[3rem] text-center mx-[0.9rem]">
						Are you sure you want to sign out?
					</h1>
					<nav>
						<button
							className={`text-clamp5 uppercase rounded-2xl bg-appred text-white px-[0.8rem] py-[0.4rem] ${
								logoutEffect && "animate-pressed"
							}`}
							onClick={() => logUserOut()}
							onAnimationEnd={() => setLogoutEffect(false)}>
							Sign me Out
						</button>
					</nav>
				</section>
			)}
		</PageWrap>
	);
}

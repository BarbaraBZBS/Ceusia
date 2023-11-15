"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { PageWrap } from "@/components/motions/pageWrap";
import Loading from "./loading";

export default function SignOut() {
	const [isLoading, setIsLoading] = useState(false);
	const [logoutEffect, setLogoutEffect] = useState(false);

	const logout = () => {
		setLogoutEffect(true);
		setTimeout(() => {
			setIsLoading(true);
			signOut({ callbackUrl: "/auth/signIn" });
		}, 600);
	};

	return (
		<PageWrap>
			{isLoading ? (
				<Loading />
			) : (
				<section className=" w-full h-[22.5rem] flex flex-col justify-center items-center">
					<h1 className="text-clamp3 my-[3rem]">See you soon!</h1>
					<nav>
						<button
							className={`text-clamp7 rounded-2xl bg-appred text-white px-[0.8rem] py-[0.4rem] ${
								logoutEffect && "animate-pressed"
							}`}
							onClick={() => logout()}
							onAnimationEnd={() => setLogoutEffect(false)}>
							Log Out
						</button>
					</nav>
				</section>
			)}
		</PageWrap>
	);
}

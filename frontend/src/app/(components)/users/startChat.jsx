"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Polar from "../../../../public/images/punk-polar-curious-nobg.gif";

export default function StartChat({ session }) {
	const [currentUser, setCurrentUser] = useState();
	useEffect(() => {
		if (session && session?.user) {
			setCurrentUser(session.user.username);
		}
	}, [session]);

	return (
		<div className="flex flex-col justify-center items-center text-center gap-[1rem]">
			<Image
				width={0}
				height={0}
				src={Polar}
				alt="robot"
				placeholder="empty"
				className="h-[32rem] object-cover"
				priority={true}
			/>
			<h2 className="text-clamp3 ">
				Hey{" "}
				<span className="text-appturq drop-shadow-lighter">
					{currentUser}!
				</span>
			</h2>
			<h3 className="text-clamp5">
				Please select a contact to start chatting.
			</h3>
		</div>
	);
}

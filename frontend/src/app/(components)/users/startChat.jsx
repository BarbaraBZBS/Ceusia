"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Polar from "../../../../public/images/punk-polar-curious-nobg.gif";

export default function StartChat({ session }) {
	const [currentUser, setCurrentUser] = useState();
	useEffect(() => {
		if (session && session?.user) {
			setCurrentUser(session?.user.username);
		}
	}, [session]);

	return (
		<div className="flex flex-col justify-center items-center text-center gap-[1rem] mob88:gap-0 pb-[2.5rem] lg:pb-[5rem]">
			<Image
				width={0}
				height={0}
				src={Polar}
				alt="robot"
				placeholder="empty"
				className="mob88:h-[29rem] h:auto sm:min-h-[45rem] lg:h-[60rem] lg:w-[40rem] object-cover"
				priority={true}
			/>
			<h2 className="text-clamp3 mob88:text-clamp5 sm:text-clamp9">
				Hey{" "}
				<span className="text-appturq drop-shadow-lighter">
					{currentUser}
				</span>{" "}
				!
			</h2>
			<h3 className="text-clamp5 mob88:text-clamp7 sm:text-clamp8 mx-[1.5rem]">
				Please select a contact to start chatting.
			</h3>
		</div>
	);
}

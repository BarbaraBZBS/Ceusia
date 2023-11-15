"use client";
import React, { useState, useEffect, useRef } from "react";
import Loading from "./loading";

export default function AppLoad() {
	const loadRef = useRef();
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			//loadRef.current.style.display = "none";
			setLoader(false);
		}, 500);
	}, []);

	return (
		<div
			ref={loadRef}
			className={
				loader
					? "w-full min-w-screen h-full z-[1000] fixed bg-white pt-[8rem]"
					: "hidden"
			}>
			<Loading />
		</div>
	);
}

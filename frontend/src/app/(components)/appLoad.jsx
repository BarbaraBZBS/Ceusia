"use client";
import React, { useState, useEffect, useRef } from "react";
import Loading from "./loading";

export default function AppLoad() {
	const loadRef = useRef();
	const [loader, setLoader] = useState(true);

	//hide loader after some time
	useEffect(() => {
		setTimeout(() => {
			//loadRef.current.style.display = "none";
			setLoader(false);
		}, 500);
	}, []);

	return (
		<div
			ref={loadRef}
			aria-label="loading"
			className={
				loader
					? "w-full h-full min-w-screen z-[1000] fixed bg-white dark:bg-appblck pt-[8rem]"
					: "hidden"
			}>
			<Loading />
		</div>
	);
}

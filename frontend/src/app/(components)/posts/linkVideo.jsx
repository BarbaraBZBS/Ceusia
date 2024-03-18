"use client";
import React, { useState, useEffect } from "react";

export default function LinkVideo({ postLink, postid, postFocus }) {
	const [video, setVideo] = useState();

	useEffect(() => {
		const handleVideo = () => {
			// console.log( 'post link : ', postLink )
			if (postLink.includes("https://www.yout")) {
				let embed = postLink.replace("watch?v=", "embed/");
				setVideo(embed.split("&")[0]);
			} else if (postLink.includes("https://yout")) {
				let embLink = postLink.replace(
					"youtu.be/",
					"www.youtube.com/embed/"
				);
				let finLink = embLink.split("?feature=shared")[0];
				setVideo(finLink.split("&")[0]);
			}
		};
		handleVideo();
	}, [postLink, video]);

	return (
		<>
			{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/mkqqwLuq30w?si=qzmipKdPCYUERrq-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
			{video ? (
				<iframe
					className="border-0 rounded-[1rem] mx-auto mt-[2.2rem] mb-[2.4rem] shadow-card"
					width="98%"
					height={postFocus ? "400" : "200"}
					src={video}
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen></iframe>
			) : (
				// allowfullscreen></iframe>
				<nav className="my-[0.4rem] mx-[0.8rem] flex justify-center text-clamp1">
					<a
						className="block px-[0.5rem] text-[blue]"
						href={postLink}>
						{postLink}
					</a>
				</nav>
			)}
		</>
	);
}

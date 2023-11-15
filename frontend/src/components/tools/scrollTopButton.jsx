"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { motion, useScroll, useAnimationControls } from "framer-motion";

const ScrollToTopContainerVariants = {
	hide: { opacity: 0, y: 70 },
	show: { opacity: 1, y: 0 },
};

export default function ScrollTopButton() {
	const [backTopEffect, setBackTopEffect] = useState(false);
	const isBrowser = () => typeof window !== "undefined";
	const { scrollYProgress } = useScroll();
	const controls = useAnimationControls();

	function scrollToTop() {
		if (!isBrowser()) return;
		document
			.getElementById("body-container")
			.scrollIntoView({ block: "start", behavior: "smooth" });
	}

	useEffect(() => {
		return scrollYProgress.on("change", (latestValue) => {
			if (latestValue > 0.2) {
				controls.start("show");
			} else {
				controls.start("hide");
			}
		});
	});

	return (
		<motion.button
			title="scroll top"
			variants={ScrollToTopContainerVariants}
			initial="hide"
			animate={controls}
			onClick={() => {
				setBackTopEffect(true);
				scrollToTop();
			}}
			onAnimationEnd={() => setBackTopEffect(false)}
			className={`fixed bottom-[2rem] right-[2.8rem] z-[99] border-none outline-none bg-apppink text-appblck rounded-lg w-[3.2rem] h-[3.2rem] hover:opacity-60 shadow-strip ${
				backTopEffect && "animate-pressDown"
			}`}>
			<FontAwesomeIcon icon={faAngleUp} size="2xl" />
		</motion.button>
	);
}

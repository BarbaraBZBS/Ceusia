"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { motion, useScroll, useAnimationControls } from "framer-motion";
import { usePathname } from "next/navigation";

const ScrollToBottomContainerVariants = {
	hide: { opacity: 0, y: 70 },
	show: { opacity: 1, y: 0 },
};

export default function ScrollBottomButton() {
	const path = usePathname();
	const [backBottomEffect, setBackBottomEffect] = useState(false);
	const isBrowser = () => typeof window !== "undefined";
	const { scrollYProgress } = useScroll();
	const controls = useAnimationControls();
	const [isPressed, setIsPressed] = useState(false);
	const [isBtnActivated, setIsBtnActivated] = useState(false);
	const [isTallContent, setIsTallContent] = useState(false);
	const isAboutPage = path === "/about";
	const enableToBottom =
		path !== "/" &&
		path !== "/auth/register" &&
		path !== "/auth/signIn" &&
		path !== "/auth/signOut" &&
		path !== "/chat";

	//media queries with instant update on device width change function and eventlistener
	useEffect(() => {
		const mediaWatch = window.matchMedia("(max-width: 410px)");
		setIsTallContent(mediaWatch.matches);

		function updateIsTallContent(e) {
			setIsTallContent(e.matches);
		}
		mediaWatch.addEventListener("change", updateIsTallContent);

		return function cleanup() {
			mediaWatch.removeEventListener("change", updateIsTallContent);
		};
	}, []);

	//handle scroll bottom button eventlistener
	useEffect(() => {
		let scrollBtn = document.getElementById("scroll-bottom");
		if (scrollBtn) {
			scrollBtn.addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					setIsPressed(true);
				}
			});
			scrollBtn.addEventListener("click", (ev) => {
				setIsPressed(false);
			});
		}
	});

	//handle scroll bottom button function
	function scrollToBottom() {
		setIsBtnActivated(true);
		if (!isBrowser()) return;
		document
			.getElementById("footer-container")
			.scrollIntoView({ block: "start", behavior: "smooth" });
	}

	//handle click and key press behavior
	useEffect(() => {
		if (isBtnActivated) {
			setTimeout(() => {
				document
					.getElementById(isPressed ? "scroll-bottom" : "footer-link")
					.focus({ focusVisible: isPressed ? true : false });
			}, 600);
		}
	}, [isPressed, isBtnActivated]);

	//button animation
	useEffect(() => {
		return scrollYProgress.on("change", (latestValue) => {
			if (latestValue > 0.05 && latestValue < 0.8) {
				controls.start("show");
			} else {
				controls.start("hide");
			}
		});
	});

	return (
		<motion.button
			title="scroll bottom"
			id="scroll-bottom"
			variants={ScrollToBottomContainerVariants}
			initial={"hide"}
			animate={controls}
			whileFocus={"show"}
			onClick={() => {
				setBackBottomEffect(true);
				scrollToBottom();
			}}
			onAnimationEnd={() => {
				setBackBottomEffect(false);
				setIsBtnActivated(false);
			}}
			className={`bottom-[2rem] left-[2.2rem] mob90:left-[1.4rem] max-[322px]:left-[1.6rem] z-[99] border-none bg-apppink dark:bg-appturq text-appblck rounded-lg w-[3.2rem] h-[3.2rem] mob88:w-[2.4rem] mob88:h-[2.4rem] hover:opacity-60 shadow-strip ${
				backBottomEffect && "animate-pressDown"
			} ${enableToBottom ? "fixed" : "hidden"} ${
				isAboutPage && (isTallContent ? "fixed" : "hidden")
			}`}>
			<FontAwesomeIcon icon={faAngleDown} size="2xl" />
		</motion.button>
	);
}

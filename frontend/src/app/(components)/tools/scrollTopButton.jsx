"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { motion, useScroll, useAnimationControls } from "framer-motion";
import { usePathname } from "next/navigation";

const ScrollToTopContainerVariants = {
	hide: { opacity: 0, y: 70 },
	show: { opacity: 1, y: 0 },
};

export default function ScrollTopButton() {
	const path = usePathname();
	const [backTopEffect, setBackTopEffect] = useState(false);
	const isBrowser = () => typeof window !== "undefined";
	const { scrollYProgress } = useScroll();
	const controls = useAnimationControls();
	const [isPressed, setIsPressed] = useState(false);
	const [isBtnActivated, setIsBtnActivated] = useState(false);
	const [isTallContent, setIsTallContent] = useState(false);
	const isAboutPage = path == "/about";
	const enableToTop =
		path !== "/" &&
		path !== "/auth/register" &&
		path !== "/auth/signIn" &&
		path !== "/auth/signOut" &&
		path !== "/chat";

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

	useEffect(() => {
		const scrollBtn = document.getElementById("scroll-top");
		if (scrollBtn) {
			scrollBtn.addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					setIsPressed(true);
				}
				scrollBtn.addEventListener("click", (ev) => {
					setIsPressed(false);
				});
			});
		}
	});

	function scrollToTop() {
		setIsBtnActivated(true);
		if (!isBrowser()) return;
		document
			.getElementById("body-container")
			.scrollIntoView({ block: "start", behavior: "smooth" });
	}

	useEffect(() => {
		if (isBtnActivated) {
			setTimeout(() => {
				document
					.getElementById(isPressed ? "skip-nav" : "logo-link")
					.focus({ focusVisible: isPressed ? true : false });
			}, 600);
		}
	}, [isPressed, isBtnActivated]);

	useEffect(() => {
		return scrollYProgress.on("change", (latestValue) => {
			if (latestValue > 0.3) {
				controls.start("show");
			} else {
				controls.start("hide");
			}
		});
	});

	return (
		<motion.button
			title="scroll top"
			id="scroll-top"
			variants={ScrollToTopContainerVariants}
			initial="hide"
			animate={controls}
			whileFocus={"show"}
			onClick={() => {
				setBackTopEffect(true);
				scrollToTop();
			}}
			onAnimationEnd={() => {
				setBackTopEffect(false);
				setIsBtnActivated(false);
			}}
			className={`bottom-[2rem] right-[2.2rem] mob90:right-[1.4rem] max-[322px]:right-[1.6rem] z-[99] border-none bg-apppink dark:bg-appturq text-appblck rounded-lg w-[3.2rem] h-[3.2rem] mob88:w-[2.4rem] mob88:h-[2.4rem] hover:opacity-60 shadow-strip ${
				backTopEffect && "animate-pressDown"
			} ${enableToTop ? "fixed" : "hidden"} ${
				isAboutPage && (isTallContent ? "fixed" : "hidden")
			}
			}`}>
			<FontAwesomeIcon icon={faAngleUp} size="2xl" />
		</motion.button>
	);
}

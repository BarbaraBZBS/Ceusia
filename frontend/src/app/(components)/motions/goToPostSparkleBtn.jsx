"use client";
import React, { useState } from "react";
import { stagger, useAnimate } from "framer-motion";

const randomNumberBetween = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function GoToPostSparkleBtn({
	post,
	setTrendBlur,
	setTrendShown,
	isTrend,
	setSearchBlur,
	setShowSearchInput,
	setShowResult,
	isSearch,
}) {
	const [isBlueBg, setIsBlueBg] = useState(false);
	const [scope, animate] = useAnimate();

	//link to post animation function
	const goToPost = () => {
		setIsBlueBg(true);
		const sparkles = Array.from({ length: 20 });
		const sparklesAnimation = sparkles.map((_, index) => [
			`.sparkle-${index}`,
			{
				x: randomNumberBetween(-70, 70),
				y: randomNumberBetween(-70, 70),
				scale: randomNumberBetween(1.1, 1.6),
				opacity: 1,
			},
			{
				duration: 0.4,
				at: "<",
			},
		]);

		const sparklesFadeOut = sparkles.map((_, index) => [
			`.sparkle-${index}`,
			{
				opacity: 0,
				scale: 0,
			},
			{
				duration: 0.3,
				at: "<",
			},
		]);

		const sparklesReset = sparkles.map((_, index) => [
			`.sparkle-${index}`,
			{
				x: 0,
				y: 0,
			},
			{
				duration: 0.000001,
			},
		]);

		animate([
			...sparklesReset,
			[".letter", { y: -28 }, { duration: 0.2, delay: stagger(0.05) }],
			[".btn", { scale: 0.8 }, { duration: 0.1, at: "<" }],
			[".btn", { scale: 1 }, { duration: 0.1 }],
			...sparklesAnimation,
			[".letter", { y: 0 }, { duration: 0.000001 }],
			...sparklesFadeOut,
		]);
		if (isTrend) {
			setTimeout(() => {
				setTrendBlur(false);
			}, 595);
			setTimeout(() => {
				setIsBlueBg(false);
				setTrendShown(false);
				document.getElementById("body-container").style.overflow = "";
			}, 601);
		} else if (isSearch) {
			setTimeout(() => {
				setSearchBlur(false);
			}, 595);
			setTimeout(() => {
				setIsBlueBg(false);
				setShowSearchInput(false);
				setShowResult(false);
				document.getElementById("body-container").style.overflow = "";
			}, 601);
		}
	};

	//changed position of sparkle span for stacking context of fixed trendingCard motion section with z-index

	return (
		<div
			ref={scope}
			className={`flex justify-end mx-[1.2rem] my-[0.8rem] text-clamp5 mob88:text-clamp7`}>
			<span
				aria-hidden
				className="absolute inset-0 block pointer-events-none"></span>
			{Array.from({ length: 20 }).map((_, index) => (
				<svg
					className={`absolute z-[2] opacity-0 bottom-[10%] sparkle-${index} ${
						isSearch &&
						"left-[80%] sm:left-[90%] xl:left-[92%] 2xl:left-[95%]"
					} ${
						isTrend &&
						"left-[80%] sm:left-[90%] lg:left-[80%] xl:left-[84%] 2xl:left-[88%]"
					}`}
					key={index}
					viewBox="0 0 122 117"
					width="10"
					height="10">
					<path
						className="fill-indigo-600 dark:fill-appopred"
						d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z"
					/>
				</svg>
			))}
			<div
				onClick={() => {
					goToPost();
				}}
				className={`btn relative z-[695] rounded-full border-2 border-indigo-600 dark:border-appopred text-[1.8rem] mob88:text-[1.2rem] text-violet-700 dark:text-appopred transition-colors dark:hover:text-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-100 dark:active:border-indigo-600 dark:active:text-indigo-600 dark:focus-visible:text-indigo-600 ${
					isBlueBg && "bg-indigo-100 dark:bg-gray-600"
				}`}>
				<a
					href={`/coms/${[post.id]}`}
					className="block rounded-full px-[1rem] py-[0.3rem] mob88:py-0 focus-visible:outline-offset-[0.3rem]">
					<span className="sr-only">Read more...</span>
					<span
						aria-hidden
						className="block h-[2.8rem] overflow-hidden">
						{[
							"R",
							"e",
							"a",
							"d",
							`\u00A0`,
							"m",
							"o",
							"r",
							"e",
							".",
							".",
							".",
						].map((letter, index) => (
							<span
								data-letter={letter}
								className="letter relative inline-block h-[2.8rem] leading-[2.8rem] after:h-[2.8rem] after:absolute after:left-0 after:top-full after:content-[attr(data-letter)]"
								key={`${letter}-${index}`}>
								{letter}
							</span>
						))}
					</span>
				</a>
			</div>
		</div>
	);
}

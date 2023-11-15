"use client";
import React, { useState } from "react";
import { stagger, useAnimate } from "framer-motion";

//const randomNumberBetween = (min, max) => {
//	return Math.floor(Math.random() * (max - min + 1) + min);
//};

export default function HomeSwitcher() {
	//	const [isBlueBg, setIsBlueBg] = useState(false);
	//	const [scope, animate] = useAnimate();
	//
	//	const onButtonClick = () => {
	//		setIsBlueBg(true);
	//		const sparkles = Array.from({ length: 20 });
	//		const sparklesAnimation = sparkles.map((_, index) => [
	//			`.sparkle-${index}`,
	//			{
	//				x: randomNumberBetween(-100, 100),
	//				y: randomNumberBetween(-100, 100),
	//				scale: randomNumberBetween(1.5, 2.5),
	//				opacity: 1,
	//			},
	//			{
	//				duration: 0.4,
	//				at: "<",
	//			},
	//		]);
	//
	//		const sparklesFadeOut = sparkles.map((_, index) => [
	//			`.sparkle-${index}`,
	//			{
	//				opacity: 0,
	//				scale: 0,
	//			},
	//			{
	//				duration: 0.3,
	//				at: "<",
	//			},
	//		]);
	//
	//		const sparklesReset = sparkles.map((_, index) => [
	//			`.sparkle-${index}`,
	//			{
	//				x: 0,
	//				y: 0,
	//			},
	//			{
	//				duration: 0.000001,
	//			},
	//		]);
	//
	//		animate([
	//			...sparklesReset,
	//			[".letter", { y: -35 }, { duration: 0.2, delay: stagger(0.05) }],
	//			["button", { scale: 0.8 }, { duration: 0.1, at: "<" }],
	//			["button", { scale: 1 }, { duration: 0.1 }],
	//			...sparklesAnimation,
	//			[".letter", { y: 0 }, { duration: 0.000001 }],
	//			...sparklesFadeOut,
	//		]);
	//		setTimeout(() => {
	//			setIsBlueBg(false);
	//		}, 601);
	//	};

	return (
		<></>
		//		<div className="w-[80%] h-full min-h-[30rem] flex flex-col m-auto items-center justify-center gap-[4rem]">
		//			<div className="" ref={scope}>
		//				<button
		//					onClick={() => {
		//						onButtonClick();
		//					}}
		//					className={`relative rounded-full border-2 border-indigo-600 px-[2.4rem] py-[0.8rem] text-[2.5rem] text-indigo-600 transition-colors hover:bg-indigo-100 ${
		//						isBlueBg && "bg-indigo-100"
		//					}`}>
		//					<span className="sr-only">Motion</span>
		//					<span
		//						className="block h-[3.5rem] overflow-hidden"
		//						aria-hidden>
		//						{["M", "o", "t", "i", "o", "n"].map((letter, index) => (
		//							<span
		//								data-letter={letter}
		//								className="letter relative inline-block h-[3.5rem] leading-[3.5rem] after:absolute after:left-0 after:top-full after:h-[3.5rem] after:content-[attr(data-letter)]"
		//								key={`${letter}-${index}`}>
		//								{letter}
		//							</span>
		//						))}
		//					</span>
		//					<span
		//						aria-hidden
		//						className="absolute inset-0 block pointer-events-none -z-20">
		//						{Array.from({ length: 20 }).map((_, index) => (
		//							<svg
		//								className={`absolute opacity-0 left-1/2 top-1/2 sparkle-${index}`}
		//								key={index}
		//								viewBox="0 0 122 117"
		//								width="10"
		//								height="10">
		//								<path
		//									className="fill-indigo-600"
		//									d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z"
		//								/>
		//							</svg>
		//						))}
		//					</span>
		//				</button>
		//			</div>
		//
		//			<div className="">
		//				<button className="rounded-full border-2 border-indigo-600 px-[2.4rem] py-[0.8rem] text-[2.4rem] text-indigo-600 transition-colors hover:bg-indigo-100">
		//					Motion
		//				</button>
		//			</div>
		//		</div>
	);
}

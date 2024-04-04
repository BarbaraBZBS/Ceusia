"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSun } from "react-icons/fa";
import { IoMdMoon } from "react-icons/io";

export default function ThemeButton() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	//make sure page is loaded
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;

	return (
		<div className="flex justify-end">
			<button
				aria-label={
					resolvedTheme === "dark"
						? "Toggle Light Mode"
						: "Toggle Dark Mode"
				}
				title={
					resolvedTheme === "dark"
						? "Toggle Light Mode"
						: "Toggle Dark Mode"
				}
				type="button"
				className="flex items-center justify-center rounded-lg p-[0.4rem] pr-[0.8rem] transition-colors hover:bg-stone-100 dark:hover:bg-stone-700"
				onClick={() =>
					setTheme(resolvedTheme === "dark" ? "light" : "dark")
				}>
				{resolvedTheme === "dark" ? (
					<FaSun className="h-[2rem] w-[2rem] mob88:h-[1.3rem] mob88:w-[1.3rem] text-yellow-400" />
				) : (
					<IoMdMoon className="h-[2rem] w-[2rem] mob88:h-[1.3rem] mob88:w-[1.3rem] text-gray-800" />
				)}
			</button>
		</div>
	);
}

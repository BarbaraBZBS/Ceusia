"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
	initial: { opacity: 0, y: 15 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 15 },
	transition: { type: "spring" },
};

export const PageWrap = ({ children }) => {
	const path = usePathname();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<AnimatePresence>
			{isClient && (
				<motion.div
					key={path}
					variants={variants}
					initial={variants.initial}
					animate={variants.animate}
					exit={variants.exit}
					transition={variants.transition}>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

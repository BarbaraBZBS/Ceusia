//2nd working workaround for exit animation on page transitions
//with framer-motion next-js with app directory
//combined with layoutClient.jsx wrapping children in layout.jsx
//and replace all links with 'a's (or buttons)
////////////////////////////////////////////////////////////////
"use client";
import { motion } from "framer-motion";

export default function Template({ children, isLoading }) {
	return (
		<>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: isLoading ? 100 : 0, opacity: isLoading ? 0 : 1 }}
				exit={{ y: 100, opacity: 0 }}
				transition={{ type: "spring", duration: 0.5 }}
				className={`flex flex-col`}>
				{children}
			</motion.div>
		</>
	);
}

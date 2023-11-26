//2nd working workaround for exit animation on page transitions
//with framer-motion next-js with app directory
//combined with layoutClient.jsx wrapping children in layout.jsx
//and replace all links with 'a's (or buttons)
////////////////////////////////////////////////////////////////
"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children, isLoading }) {
	const path = usePathname();
	const csian = path.startsWith("/csian");
	const upd = path.startsWith("/upd");
	const coms = path.startsWith("/coms");

	return (
		<>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: isLoading ? 100 : 0, opacity: isLoading ? 0 : 1 }}
				exit={{ y: 100, opacity: 0 }}
				transition={{ type: "spring", duration: 0.5 }}
				className={`flex flex-col ${
					path === "/" || path === "/auth/signIn"
						? "min-h-[57rem]"
						: path === "/auth/register"
						? "min-h-[60rem]"
						: csian
						? "min-h-[62rem]"
						: upd
						? "min-h-[67rem]"
						: coms
						? "min-h-[70.6rem]"
						: "min-h-[80rem]"
				}`}>
				{children}
			</motion.div>
		</>
	);
}

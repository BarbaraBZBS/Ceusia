//example framer-motion workaround
//not used in project

//working workaround for exit animation on page transitions
//with framer-motion next-js with app directory
//wrap motion pages with this component
//combined with ChangeRoute.jsx replacing all links or buttons/'a's
//remove any motion component wrapping children in layout.jsx
////////////////////////////////////////////////////////////////
"use client";
import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
			className="routePage transition-opacity duration-1000">
			{children}
		</motion.div>
	);
}

//2nd working workaround for exit animation on page transitions
//with framer-motion next-js with app directory
//wrap children into layout.jsx with this component
//combined with template.jsx
//and replace all links with 'a's (or buttons)
////////////////////////////////////////////////////////////

"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Template from "./template";

export default function RootLayoutClient({ children }) {
	const pathName = usePathname();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	//handle navigation buttons function
	useEffect(() => {
		const onClick = (e) => {
			const target = e.target;
			let foundTarget;
			foundTarget = target;
			if (
				target.tagName.toLowerCase() !== "a" &&
				target.tagName.toLowerCase() !== "button"
			) {
				const closestAnchor = target.closest("a");
				if (closestAnchor) {
					foundTarget = closestAnchor;
				}
			}

			const lcTagName = foundTarget.tagName.toLowerCase();

			if (lcTagName === "a" || lcTagName === "button") {
				const href = foundTarget.getAttribute("href");
				if (href && href.startsWith("/")) {
					e.preventDefault();
					if (href !== pathName) {
						setTimeout(() => {
							setIsLoading(true);
						}, 500);
						setTimeout(() => {
							router.push(href);
						}, 1000);
					}
				}
			}
		};
		window.addEventListener("click", onClick);
		return () => window.removeEventListener("click", onClick);
	}, [router, pathName]);

	//scroll top when loader is gone
	useEffect(() => {
		window.scrollTo(0, 0);
		setIsLoading(false);
	}, [pathName]);

	return <Template isLoading={isLoading}>{children}</Template>;
}

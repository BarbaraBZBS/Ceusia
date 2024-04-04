//example framer-motion workaround
//not used in project

//working workaround for exit animation on page transitions
//with framer-motion next-js with app directory
//replace links or buttons or 'a's with this component
//combined with PageWrapper component : wrap motion pages with PageWrapper
//remove any motion component wrapping children in layout.jsx
////////////////////////////////
"use client";
import { useRouter } from "next/navigation";

export default function ChangeRoute({ children, href, className }) {
	const router = useRouter();
	const handleNavigation = () => {
		const routePage = document.querySelectorAll(".routePage");
		routePage.forEach(
			(page) => (
				(page.style.opacity = 0),
				(page.style.transform = "translateY(5px)"),
				(page.style.transition = "all 0.5s")
			)
		);
		setTimeout(() => {
			router.push(href);
		}, 500);
	};

	return (
		<button
			onClick={() => handleNavigation()}
			className={`cursor-pointer ${className}`}>
			{children}
		</button>
	);
}

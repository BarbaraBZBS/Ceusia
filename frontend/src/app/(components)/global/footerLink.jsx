"use client";
import { usePathname } from "next/navigation";

export default function FooterLink() {
	const currentRoute = usePathname();
	return (
		<a
			id="footer-link"
			className={
				currentRoute === "/about"
					? "text-clamp1 mob88:text-clamp2 sm:text-clamp6 lg:text-clamp1 hover:text-appturq hover:translate-y-1 active:text-appturq active:underline transition-all duration-200 ease-in-out text-apppink dark:text-appopred focus:text-apppink drop-shadow-linkTxt underline uppercase underline-offset-4"
					: "hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out text-clamp1 mob88:text-clamp2 sm:text-clamp6 underline-offset-4"
			}
			href={"/about"}
			as={"/about"}>
			About
		</a>
	);
}

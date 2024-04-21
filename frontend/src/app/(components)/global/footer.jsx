import Image from "next/image";
import FooterLink from "./footerLink";

export default function Footer() {
	return (
		<footer
			id="footer-container"
			className="mt-auto bg-gray-200 bg-opacity-60 flex flex-col text-appmagenta dark:bg-appblck dark:border-t-gray-700 dark:border-t-[0.1rem] dark:text-apppinklighter">
			<div className="flex justify-end p-[1.2rem] m-[1.2rem]">
				<nav className="linkAnim hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out">
					<FooterLink />
				</nav>
			</div>
			<div className="text-clamp2 mob88:text-[1.2rem] sm:text-clamp6 lg:text-clamp2 mx-[2.8rem] text-center lg:mx-[3.5rem]">
				<p>
					Lorem ipsum odor amet, consectetuer adipiscing elit. Eget
					nisl hendrerit pellentesque nunc molestie quisque mattis.
					Finibus nostra cubilia ipsum scelerisque faucibus nullam
					ligula conubia curabitur. Ipsum nulla nunc risus potenti
					risus nisi dictum. Facilisis mattis tincidunt proin
					consequat; enim nullam. Nulla suspendisse curae lectus;
					gravida eros feugiat sollicitudin faucibus. Bibendum curae
					bibendum fermentum etiam etiam.
				</p>
			</div>
			<nav className="my-[0.8rem] flex flex-col justify-center items-center text-clamp2 mob88:text-[1.2rem] sm:text-clamp6 lg:text-clamp2">
				<a href={`mailto:${"logi@ceusia.com"}`}>📧 logi@ceusia.com</a>
				<a href={`tel:${"565 54 985 653 333"}`}>
					📞 565 54 985 653 333
				</a>
				<p>📬 569 floral street 98632 ALJIFLAS</p>
			</nav>
			<div className="flex justify-center text-clamp2 mob88:text-[1.1rem] items-center text-center">
				<p>Copyright 1999-2023 by Ceusia. All Rights Reserved.</p>
			</div>
			<div className="flex justify-center my-[1.2rem]">
				<Image
					className="h-auto object-cover mob88:max-h-[2.8rem] mob88:max-w-[2.8rem]"
					src="/images/logoSmRound.png"
					alt="ceusia footer logo"
					width={35}
					height={35}
					priority={true}
					style={{ width: "3.5rem", height: "3.5rem" }}
				/>
			</div>
		</footer>
	);
}

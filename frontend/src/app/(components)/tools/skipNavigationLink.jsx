import React from "react";

export default function SkipNavigationLink() {
	return (
		<a
			id="skip-nav"
			href="#main-container"
			className="absolute left-[-1000px] z-[1010] focus:left-0 text-white bg-appmauvedark">
			Skip Navigation
		</a>
	);
}

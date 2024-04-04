import React from "react";

export default function Loading() {
	return (
		<div className="flex justify-center w-screen h-screen mt-[16rem]">
			<div
				role="status"
				className="w-[4.8rem] h-[4.8rem] rounded-full animate-spin border-x-4 border-solid border-apppink border-t-transparent shadow-md"></div>
		</div>
	);
}

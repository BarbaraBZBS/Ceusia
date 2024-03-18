"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";

export default function PaginationController({
	hasPrevPage,
	hasNextPage,
	totalPages,
}) {
	const searchParams = useSearchParams();
	const page = searchParams.get("page") ?? "1";
	const per_page = searchParams.get("per_page") ?? "6";
	const [firstPageEffect, setFirstPageEffect] = useState(false);
	const [prevPageEffect, setPrevPageEffect] = useState(false);
	const [nextPageEffect, setNextPageEffect] = useState(false);
	const [lastPageEffect, setLastPageEffect] = useState(false);
	//console.log("page", page);
	//console.log("per_page", per_page);

	return (
		<div className="flex gap-2 justify-center items-center my-[2rem] text-clamp2">
			{hasPrevPage ? (
				<>
					<nav
						onClick={() => {
							setFirstPageEffect(true);
						}}
						onAnimationEnd={() => setFirstPageEffect(false)}
						className={`bg-indigo-500 dark:bg-[#0f12a5] text-white rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							firstPageEffect && "animate-bgSize"
						}`}>
						<a
							aria-label="Go to First page"
							href={`?page=1&per_page=${per_page}`}
							className="block p-[0.4rem] rounded-xl">
							<FontAwesomeIcon icon={faAnglesLeft} /> First
						</a>
					</nav>
					<nav
						onClick={() => {
							setPrevPageEffect(true);
						}}
						onAnimationEnd={() => setPrevPageEffect(false)}
						className={`bg-indigo-500 dark:bg-[#0f12a5] text-white mr-[0.4rem] ml-[0.2rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							prevPageEffect && "animate-bgSize"
						}`}>
						<a
							aria-label="Go to Previous Page"
							href={`?page=${
								Number(page) - 1
							}&per_page=${per_page}`}
							className="block p-[0.4rem] rounded-xl">
							<FontAwesomeIcon icon={faAngleLeft} /> Prev
						</a>
					</nav>
				</>
			) : (
				<>
					<button
						aria-disabled
						aria-label="Go to First Page"
						className="bg-indigo-500 dark:bg-[#0f12a5] text-white p-[0.4rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAnglesLeft} /> First
					</button>
					<button
						aria-disabled
						aria-label="Go to Previous Page"
						className="bg-indigo-500 dark:bg-[#0f12a5] text-white p-[0.4rem] mr-[0.4rem] ml-[0.2rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAngleLeft} /> Prev
					</button>
				</>
			)}
			<div aria-hidden>
				{page} / {totalPages}
			</div>
			<div
				className="sr-only"
				aria-label={`page ${page} out of ${totalPages}`}></div>

			{hasNextPage ? (
				<>
					<nav
						onClick={() => {
							setNextPageEffect(true);
						}}
						onAnimationEnd={() => setNextPageEffect(false)}
						className={`bg-indigo-500 dark:bg-[#0f12a5] text-white mr-[0.2rem] ml-[0.4rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							nextPageEffect && "animate-bgSize"
						}`}>
						<a
							aria-label="Go to Next Page"
							href={`?page=${
								Number(page) + 1
							}&per_page=${per_page}`}
							className="block p-[0.4rem] rounded-xl">
							Next <FontAwesomeIcon icon={faAngleRight} />
						</a>
					</nav>
					<nav
						onClick={() => {
							setLastPageEffect(true);
						}}
						onAnimationEnd={() => setLastPageEffect(false)}
						className={`bg-indigo-500 dark:bg-[#0f12a5] text-white rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred dark:hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							lastPageEffect && "animate-bgSize"
						}`}>
						<a
							aria-label="Go to Last Page"
							href={`?page=${totalPages}&per_page=${per_page}`}
							className="block p-[0.4rem] rounded-xl">
							Last <FontAwesomeIcon icon={faAnglesRight} />
						</a>
					</nav>
				</>
			) : (
				<>
					<button
						aria-disabled
						aria-label="Go to Next Page"
						className="cursor-pointer bg-indigo-500 dark:bg-[#0f12a5] text-white p-[0.4rem] mr-[0.2rem] ml-[0.4rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAngleRight} /> Next
					</button>
					<button
						aria-disabled
						aria-label="Go to Last Page"
						className="cursor-pointer bg-indigo-500 dark:bg-[#0f12a5] text-white p-[0.4rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAnglesRight} /> Last
					</button>
				</>
			)}
		</div>
	);
}

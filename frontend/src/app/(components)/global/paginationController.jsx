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
		<div className="flex gap-2 justify-center items-center my-[0.8rem] text-clamp2">
			{hasPrevPage ? (
				<>
					<nav
						onClick={() => {
							setFirstPageEffect(true);
						}}
						onAnimationEnd={() => setFirstPageEffect(false)}
						className={`bg-indigo-500 text-white p-[0.4rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							firstPageEffect && "animate-bgSize"
						}`}>
						<a href={`?page=1&per_page=${per_page}`}>
							<FontAwesomeIcon icon={faAnglesLeft} /> First
						</a>
					</nav>
					<nav
						onClick={() => {
							setPrevPageEffect(true);
						}}
						onAnimationEnd={() => setPrevPageEffect(false)}
						className={`bg-indigo-500 text-white p-[0.4rem] mr-[0.4rem] ml-[0.2rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							prevPageEffect && "animate-bgSize"
						}`}>
						<a
							href={`?page=${
								Number(page) - 1
							}&per_page=${per_page}`}>
							<FontAwesomeIcon icon={faAngleLeft} /> Prev
						</a>
					</nav>
				</>
			) : (
				<>
					<p className="cursor-pointer bg-indigo-500 text-white p-[0.4rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAnglesLeft} /> First
					</p>
					<p className="cursor-pointer bg-indigo-500 text-white p-[0.4rem] mr-[0.4rem] ml-[0.2rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAngleLeft} /> Prev
					</p>
				</>
			)}
			<div>
				{page} / {totalPages}
			</div>

			{hasNextPage ? (
				<>
					<nav
						onClick={() => {
							setNextPageEffect(true);
						}}
						onAnimationEnd={() => setNextPageEffect(false)}
						className={`bg-indigo-500 text-white p-[0.4rem] mr-[0.2rem] ml-[0.4rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							nextPageEffect && "animate-bgSize"
						}`}>
						<a
							href={`?page=${
								Number(page) + 1
							}&per_page=${per_page}`}>
							Next <FontAwesomeIcon icon={faAngleRight} />
						</a>
					</nav>
					<nav
						onClick={() => {
							setLastPageEffect(true);
						}}
						onAnimationEnd={() => setLastPageEffect(false)}
						className={`bg-indigo-500 text-white p-[0.4rem] rounded-xl transition-all duration-300 ease-in-out hover:bg-appopred hover:text-appblck hover:translate-y-[3px] hover:shadow-btnblue bg-[linear-gradient(#01b3d9,#01b3d9)] bg-[position:50%_50%] bg-no-repeat bg-[size:0%_0%] shadow-neatcard ${
							lastPageEffect && "animate-bgSize"
						}`}>
						<a href={`?page=${totalPages}&per_page=${per_page}`}>
							Last <FontAwesomeIcon icon={faAnglesRight} />
						</a>
					</nav>
				</>
			) : (
				<>
					<p className="cursor-pointer bg-indigo-500 text-white p-[0.4rem] mr-[0.2rem] ml-[0.4rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAngleRight} /> Next
					</p>
					<p className="cursor-pointer bg-indigo-500 text-white p-[0.4rem] opacity-50 rounded-xl">
						<FontAwesomeIcon icon={faAnglesRight} /> Last
					</p>
				</>
			)}
		</div>
	);
}

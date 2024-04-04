"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";

export default function TimeDisplay() {
	const [date, setDate] = useState(moment().format("dddd, MMMM D, YYYY"));
	const [time, setTime] = useState(moment().format("h:mm:ss A"));

	//clock display
	useEffect(() => {
		setInterval(() => {
			setDate(moment().format("dddd, MMMM D, YYYY"));
			setTime(moment().format("h:mm:ss A"));
		}, 1000);
	}, []);

	return (
		<div className="flex flex-col gap-[0.8rem] justify-center items-center font-medium">
			<p className="text-clamp3 mob88:text-clamp5">{date}</p>
			<p className="text-clamp3 mob88:text-clamp5">{time}</p>
		</div>
	);
}

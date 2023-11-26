"use client";
import React, { useEffect } from "react";

const useTimeCheck = () => {
	const storage = window.localStorage;
	const currTimestamp = date.now();
	const timestamp = json.parse(storage.getItem("timestamp") || "1000");

	const timeLimit = 2 * 60 * 60 * 1000; // 2 hours

	const hasTimePassed = currTimestamp - timestamp > timeLimit;

	useEffect(() => {
		hasTimePassed
			? storage.setItem("timestamp", currTimestamp.tostring())
			: storage.setItem("timestamp", timestamp.tostring());
	}, [hasTimePassed, storage, currTimestamp, timestamp]);

	return hasTimePassed;
};

export default useTimeCheck;

"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "../axios";
import { getStored } from "@/app/actions";

export const useRefreshToken = () => {
	const { data: session, status } = useSession();
	const [secToken, setSecToken] = useState();
	//const secRefresh = getStored();
	useEffect(() => {
		const secRefresh = getStored();
		setSecToken(secRefresh);
	}, []);

	const refreshedToken = async () => {
		let res;
		// console.log( 'session refresh : ', session?.user.refreshToken )
		if (!session || status === "loading") {
			res = await axios.post("/auth/refresh", {
				refreshToken: secToken,
			});
		} else {
			res = await axios.post("/auth/refresh", {
				refreshToken: session?.user.refreshToken,
			});
		}

		if (session) session.user.token = res.data.token;
	};

	return refreshedToken;
};

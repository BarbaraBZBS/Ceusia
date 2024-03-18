"use client";
import React, { useState, useEffect } from "react";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import axios from "@/app/(utils)/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function MeetFollow(props) {
	const axiosAuth = useAxiosAuth();
	const [followed, setFollowed] = useState(false);
	const [followEffect, setFollowEffect] = useState(false);

	useEffect(() => {
		const checkFollowingStatus = async () => {
			const data = {
				user_id: props.session.user.user_id,
				follower_id: props.usr.id,
			};
			const res = await axiosAuth({
				method: "post",
				url: "/auth/followstatus",
				data: data,
			});
			const status = res.data.message;
			// console.log( 'res foll status : ', status );
			if (status === "followed") setFollowed(true);
		};
		checkFollowingStatus();
	}, [props.session, props.usr, followed, axiosAuth]);

	const handleFollow = () => {
		setFollowEffect(true);
		const data = {
			follower_id: props.session.user.user_id,
		};
		setTimeout(async () => {
			try {
				await axiosAuth({
					method: "post",
					url: `/auth/follow/${props.usr.id}`,
					data: data,
				});
				setFollowed(true);
				const res = await axios.get(
					`/auth/user/${props.session.user.user_id}/followers`
				);
				const resp = await axios.get(
					`/auth/user/${props.session.user.user_id}/following`
				);
				props.setAllFollowers(res.data.count);
				props.setAllFollowings(resp.data.count);
			} catch (err) {
				if (!err?.response) {
					console.log(err);
					props.setErrMsg("No response.");
					setTimeout(() => {
						props.setErrMsg("");
					}, 4000);
				} else {
					console.log(err);
					props.setErrMsg("Following failed.");
					setTimeout(() => {
						props.setErrMsg("");
					}, 4000);
				}
			}
		}, 500);
	};

	return (
		<>
			{followed ? (
				<div className="flex items-center">
					<button
						title="followed"
						className="bg-appstone dark:bg-appmauvedark text-clamp6 mob88:text-[1.2rem] text-green-500 w-[3.4rem] h-[2.8rem] mob88:w-[2.4rem] mob88:h-[1.8rem] rounded-3xl shadow-neatcard focus-visible:outline-offset-[0.3rem]">
						<FontAwesomeIcon icon={faCheck} />
					</button>
				</div>
			) : (
				<div className="flex items-center">
					<button
						title="follow user"
						onClick={() => {
							handleFollow();
						}}
						onAnimationEnd={() => setFollowEffect(false)}
						className={`bg-appstone dark:bg-appmauvedark text-clamp6 mob88:text-[1.2rem] text-white w-[3.4rem] h-[2.8rem] mob88:w-[2.4rem] mob88:h-[1.8rem] rounded-3xl transition-all duration-300 ease-in-out
                    hover:bg-appopred dark:hover:bg-appopred hover:border-appopred hover:text-appblck hover:translate-y-[7px] hover:shadow-btnblue shadow-neatcard focus-visible:outline-offset-[0.3rem] ${
						followEffect &&
						"animate-btnFlat text-appblck bg-apppastgreen"
					}`}>
						<FontAwesomeIcon icon={faUserPlus} />
					</button>
				</div>
			)}
		</>
	);
}

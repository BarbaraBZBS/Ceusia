"use client";
import React, { useEffect } from "react";
import axios from "@/app/(utils)/axios";

export default function HomeFollows(props) {
	useEffect(() => {
		const getFollowers = async () => {
			const res = await axios.get(
				`/auth/user/${props.session.user.user_id}/followers`
			);
			props.setAllFollowers(res.data.count);
		};
		const getFollowing = async () => {
			const res = await axios.get(
				`/auth/user/${props.session.user.user_id}/following`
			);
			props.setAllFollowings(res.data.count);
		};
		getFollowers();
		getFollowing();
	}, [props]);

	return (
		<section className="w-full flex flex-col justify-start max-[354px]:w-[50%]">
			<div className="w-fit text-clamp2 mob88:text-[1.2rem] bg-appmauvedark dark:bg-appmauvedarker px-[0.8rem] py-[0.4rem] border-2 border-appmauvedark dark:border-appmauvedarker rounded-xl mb-[1.2rem] leading-none text-white shadow-neatcard">
				{props.allFollowers === 1 ? (
					<p title="my followers" className="">
						{props.allFollowers} follower{" "}
					</p>
				) : (
					<p title="my followers" className="">
						{props.allFollowers} followers{" "}
					</p>
				)}
				{props.allFollowings === 1 ? (
					<p title="my followings" className="">
						{" "}
						{props.allFollowings} following
					</p>
				) : (
					<p title="my followings" className="">
						{" "}
						{props.allFollowings} followings
					</p>
				)}
			</div>
		</section>
	);
}

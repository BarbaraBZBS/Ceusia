"use client";
import React, { useState, useEffect } from "react";
import axios from "@/app/(utils)/axios";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function FollowersFollowing({ user }) {
	const axiosAuth = useAxiosAuth();
	const [followers, setFollowers] = useState(0);
	const [following, setFollowing] = useState(0);
	const [followersListEffect, setFollowersListEffect] = useState(false);
	const [followingsListEffect, setFollowingsListEffect] = useState(false);
	const [followersShown, setFollowersShown] = useState(false);
	const [followingsShown, setFollowingsShown] = useState(false);
	const [usrFollowersList, setUsrFollowersList] = useState([]);
	const [usrFollowingsList, setUsrFollowingsList] = useState([]);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [usrLinkEffect, setUsrLinkEffect] = useState(false);
	const [followsErrMsg, setFollowsErrMsg] = useState(false);

	//get logged user followers and followings amount functions
	useEffect(() => {
		const getFollowers = async () => {
			const res = await axios.get(`/auth/user/${user.id}/followers`);
			setFollowers(res.data.count);
		};
		const getFollowing = async () => {
			const res = await axios.get(`/auth/user/${user.id}/following`);
			setFollowing(res.data.count);
		};
		getFollowers();
		getFollowing();
	}, [user.id, followers, following]);

	//show followers list function
	function showFollowersList() {
		setFollowsErrMsg("");
		if (followers !== 0) {
			setFollowersListEffect(true);
			let followersArray = [];
			setTimeout(async () => {
				try {
					const res = await axiosAuth.get(
						`/auth/user/${user.id}/followers`
					);
					for (let row of res.data.rows) {
						const resp = await axiosAuth.get(
							`/auth/user/${row.follower_id}`
						);
						followersArray.push(resp.data);
						setUsrFollowersList(followersArray);
					}
					setFollowersShown(!followersShown);
					setFollowingsShown(false);
				} catch (err) {
					if (!err?.response) {
						setFollowsErrMsg(
							"Server unresponsive, please try again or come back later."
						);
					} else {
						setFollowsErrMsg(
							"Impossible to get followers, please try again."
						);
					}
				}
			}, 500);
		}
	}

	//show followings list function
	function showFollowingsList() {
		setFollowsErrMsg("");
		if (following !== 0) {
			setFollowingsListEffect(true);
			let followingArray = [];
			setTimeout(async () => {
				try {
					const res = await axiosAuth.get(
						`/auth/user/${user.id}/following`
					);
					for (let row of res.data.rows) {
						const resp = await axiosAuth.get(
							`/auth/user/${row.user_id}`
						);
						followingArray.push(resp.data);
						setUsrFollowingsList(followingArray);
					}
					setFollowingsShown(!followingsShown);
					setFollowersShown(false);
				} catch (err) {
					if (!err?.response) {
						setFollowsErrMsg(
							"Server unresponsive, please try again or come back later."
						);
					} else {
						setFollowsErrMsg(
							"Impossible to get followings, please try again."
						);
					}
				}
			}, 500);
		}
	}

	const usrProfileLnk = () => {
		setUsrLinkEffect(true);
	};

	return (
		<div className="my-[1rem] w-[80%]">
			<div className="mb-[1.6rem] flex justify-evenly">
				{followers === 1 ? (
					<button
						title={
							followersShown ? "hide followers" : "show followers"
						}
						onClick={() => showFollowersList()}
						onAnimationEnd={() => setFollowersListEffect(false)}
						className={`rounded-full border-[0.3rem] border-appmauvedark dark:border-apppastgreen text-appmauvedark bg-apppastgreen px-[1.2rem] mob48:px-[0.3rem] mob48:mx-[0.5rem] hover:bg-apppinklight font-semibold shadow-neatcard focus-visible:outline-offset-[0.4rem] ${
							followersListEffect && "animate-pressed"
						} ${
							followersShown &&
							"border-appgreenlight dark:border-pink-600"
						}`}>
						{followers} follower{" "}
					</button>
				) : (
					<button
						title={
							followersShown ? "hide followers" : "show followers"
						}
						onClick={() => showFollowersList()}
						onAnimationEnd={() => setFollowersListEffect(false)}
						className={`rounded-full border-[0.3rem] border-appmauvedark dark:border-apppastgreen text-appmauvedark bg-apppastgreen px-[1.2rem] mob48:px-[0.3rem] mob48:mx-[0.5rem] hover:bg-apppinklight font-semibold shadow-neatcard focus-visible:outline-offset-[0.4rem] ${
							followersListEffect && "animate-pressed"
						} ${
							followersShown &&
							"border-appgreenlight dark:border-pink-600"
						}`}>
						{followers} followers{" "}
					</button>
				)}
				{following === 1 ? (
					<button
						title={
							followingsShown
								? "hide followings"
								: "show followings"
						}
						onClick={() => showFollowingsList()}
						onAnimationEnd={() => setFollowingsListEffect(false)}
						className={`rounded-full border-[0.3rem] border-appmauvedark dark:border-apppastgreen text-appmauvedark bg-apppastgreen px-[1.2rem] mob48:px-[0.3rem] mob48:mx-[0.5rem] hover:bg-apppinklight font-semibold shadow-neatcard focus-visible:outline-offset-[0.4rem] ${
							followingsListEffect && "animate-pressed"
						} ${
							followingsShown &&
							"border-appgreenlight dark:border-pink-600"
						}`}>
						{" "}
						{following} following
					</button>
				) : (
					<button
						title={
							followingsShown
								? "hide followings"
								: "show followings"
						}
						onClick={() => showFollowingsList()}
						onAnimationEnd={() => setFollowingsListEffect(false)}
						className={`rounded-full border-[0.3rem] border-appmauvedark dark:border-apppastgreen text-appmauvedark bg-apppastgreen px-[1.2rem] mob48:px-[0.3rem] mob48:mx-[0.5rem] hover:bg-apppinklight font-semibold shadow-neatcard focus-visible:outline-offset-[0.4rem] ${
							followingsListEffect && "animate-pressed"
						} ${
							followingsShown &&
							"border-appgreenlight dark:border-pink-600"
						}`}>
						{" "}
						{following} followings
					</button>
				)}
			</div>
			<AnimatePresence>
				{followsErrMsg && (
					<motion.p
						initial={{
							x: 70,
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						exit={{
							x: 70,
							opacity: 0,
						}}
						transition={{
							type: "popLayout",
						}}
						className="self-center mob48:w-full text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] mob48:mx-0 rounded-md w-fit px-[0.8rem] text-clamp6 mb-[2rem]"
						role="alert"
						aria-live="assertive">
						{followsErrMsg}
					</motion.p>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{followers !== 0 && followersShown ? (
					usrFollowersList?.map((usr, index) => (
						<motion.div
							key={usr.id}
							initial={{ opacity: 0, x: "100vw" }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: "100vw" }}
							transition={{ duration: 0.6, origin: 1 }}
							className="w-[60%] mob48:w-[80%] flex justify-center mx-auto my-[0.4rem] text-clamp7 items-center">
							<div className="w-[2.4rem] h-[2.4rem] rounded-full border-[1px] border-gray-300 mr-[1.6rem] my-auto">
								<Image
									width={0}
									height={0}
									placeholder="empty"
									className="rounded-full object-cover w-full h-full"
									src={`${process.env.NEXT_PUBLIC_API}${usr.picture}`}
									alt={`${usr.username} picture`}
								/>
							</div>
							<nav
								className={`hover:text-appturq active:text-appturq m-auto text-ellipsis overflow-hidden ${
									clickedBtn === index &&
									usrLinkEffect &&
									"animate-resizeBtn"
								}`}
								onClick={() => {
									setClickedBtn(index);
									usrProfileLnk();
								}}
								onAnimationEnd={() => setUsrLinkEffect(false)}>
								<a
									href={`/csian/${[usr.id]}`}
									className="block text-ellipsis overflow-hidden m-[0.5rem] p-[0.2rem]">
									{usr.username}
								</a>
							</nav>
						</motion.div>
					))
				) : (
					<div></div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{following !== 0 && followingsShown ? (
					usrFollowingsList?.map((usr, index) => (
						<motion.div
							key={usr.id}
							initial={{ opacity: 0, x: "100vw" }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: "100vw" }}
							transition={{ duration: 0.6, origin: 1 }}
							className="w-[60%] mob48:w-[80%] flex justify-center mx-auto my-[0.4rem] text-clamp7 items-center">
							<div className="w-[2.4rem] h-[2.4rem] rounded-full border-[1px] border-gray-300 mr-[1.6rem] my-auto">
								<Image
									width={0}
									height={0}
									placeholder="empty"
									className="rounded-full object-cover w-full h-full"
									src={`${process.env.NEXT_PUBLIC_API}${usr.picture}`}
									alt={`${usr.username} picture`}
								/>
							</div>
							<nav
								className={`hover:text-appturq active:text-appturq m-auto text-ellipsis overflow-hidden ${
									clickedBtn === index &&
									usrLinkEffect &&
									"animate-resizeBtn"
								}`}
								onClick={() => {
									setClickedBtn(index);
									usrProfileLnk();
								}}
								onAnimationEnd={() => setUsrLinkEffect(false)}>
								<a
									href={`/csian/${[usr.id]}`}
									className="block m-[0.5rem] p-[0.2rem] text-ellipsis overflow-hidden">
									{usr.username}
								</a>
							</nav>
						</motion.div>
					))
				) : (
					<div></div>
				)}
			</AnimatePresence>
		</div>
	);
}

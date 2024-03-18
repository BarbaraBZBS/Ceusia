"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import MeetFollow from "./meetFollow";
import { FocusOn } from "react-focus-on";
import { useMediaQuery } from "react-responsive";

export default function SuggestionsCard(props) {
	const axiosAuth = useAxiosAuth();
	const router = useRouter();
	const [meetShown, setMeetShown] = useState(false);
	const [showMeetEffect, setShowMeetEffect] = useState(false);
	const [hideMeetEffect, setHideMeetEffect] = useState(false);
	const [blur, setBlur] = useState(false);
	const [peopleList, setPeopleList] = useState([]);
	const [usrLinkEffect, setUsrLinkEffect] = useState(false);
	const [clickedBtn, setClickedBtn] = useState(0);
	const [errMsg, setErrMsg] = useState("");
	const isSmallDevice = useMediaQuery({
		query: "(max-width: 1023px)",
	});
	const isBiggerDevice = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	useEffect(() => {
		const getPeopleList = async () => {
			let friends = [];
			let array = [];
			const res = await axiosAuth.get(
				`/auth/user/${props.session.user.user_id}/following`
			);
			res.data.rows.map((usrfollowed) => {
				friends.push(usrfollowed.user_id);
			});
			props.users.slice(0, 12).map((user) => {
				if (
					user.id !== props.session.user.user_id &&
					!friends.includes(user.id)
				) {
					return array.push(user);
				}
			});
			const sortedPeople = array.sort(() => 0.5 - Math.random());
			setPeopleList(sortedPeople);
		};
		if (props.users[0]) {
			getPeopleList();
		}
	}, [props.session, props.users, meetShown, axiosAuth]);

	const showMeet = () => {
		setShowMeetEffect(true);
		setTimeout(() => {
			setMeetShown(true);
		}, 500);
		setTimeout(() => {
			setBlur(true);
		}, 1300);
	};

	const hideMeet = () => {
		setHideMeetEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			setMeetShown(false);
		}, 500);
	};

	const usrProfileLnk = () => {
		setUsrLinkEffect(true);
		setTimeout(() => {
			setBlur(false);
		}, 490);
		setTimeout(() => {
			setMeetShown(false);
		}, 500);
	};

	return (
		<>
			{isSmallDevice && (
				<>
					{meetShown ? (
						<button
							title="hide friends suggestion"
							className="mob88:text-[1.2rem] bg-apppastgreen dark:bg-applightdark border-2 border-apppastgreen dark:border-applightdark rounded-tl-lg rounded-bl-lg pl-[0.8rem] pr-[0.4rem] hover:text-appmauvedark dark:hover:text-appopred shadow-strip"
							onClick={() => hideMeet()}>
							<FontAwesomeIcon
								icon={faChevronRight}
								className={`text-clamp1 mob88:text-[1.2rem] ${
									hideMeetEffect && "animate-slideRight"
								}`}
								onAnimationEnd={() => setHideMeetEffect(false)}
							/>
						</button>
					) : (
						<button
							title="show friends suggestion"
							className="mob88:text-[1.2rem] bg-apppastgreen dark:bg-applightdark border-2 border-apppastgreen dark:border-applightdark rounded-tl-lg rounded-bl-lg pl-[0.6rem] pr-[0.8rem] hover:text-appmagenta dark:hover:text-appopred shadow-strip"
							onClick={() => showMeet()}>
							<FontAwesomeIcon
								icon={faChevronLeft}
								className={`text-clamp1 mob88:text-[1.2rem] ${
									showMeetEffect && "animate-slideLeft"
								}`}
								onAnimationEnd={() => setShowMeetEffect(false)}
							/>
							<span className="text-clamp2 ml-[0.4rem] mob88:text-[1.2rem]">
								Socialize
							</span>
						</button>
					)}
					<AnimatePresence>
						{meetShown && (
							<motion.section
								key="meet-card"
								initial={{ opacity: 0, x: "100vw" }}
								animate={{ opacity: 1, x: 0 }}
								exit={{
									opacity: 0,
									y: 60,
									transition: {
										ease: "easeIn",
										duration: 0.6,
										delay: 0.1,
									},
								}}
								transition={{ duration: 0.5, origin: 1 }}
								className={`z-[690] w-screen top-0 left-0 h-full fixed ${
									blur && "animate-pop"
								}`}>
								<div
									className={`absolute w-full top-[17.5rem] border-2 border-apppastgreen dark:border-applightdark bg-apppastgreen dark:bg-applightdark pt-[0.8rem] pb-[3.2rem] rounded-2xl shadow-neatcard ${
										meetShown && "flex flex-col"
									} ${!meetShown && "hidden"}`}>
									<FocusOn
										onClickOutside={() => hideMeet()}
										onEscapeKey={() => hideMeet()}>
										<div
											role="dialog"
											aria-labelledby="meet-ttl">
											<div className="flex justify-end mr-[0.4rem]">
												<button
													aria-label="close suggestions"
													onClick={() => hideMeet()}>
													<FontAwesomeIcon
														icon={faXmark}
														size="2xl"
														onAnimationEnd={() =>
															setHideMeetEffect(
																false
															)
														}
														className={`cursor-pointer hover:text-appred ${
															hideMeetEffect &&
															"animate-pressed opacity-60"
														}`}
													/>
												</button>
											</div>
											<h2
												id="meet-ttl"
												className="text-center uppercase text-clamp5 mob88:text-clamp7 mb-[2.4rem] font-semibold">
												Socialize
											</h2>
											<div className="flex justify-center items-center">
												<AnimatePresence>
													{errMsg && (
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
															className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 my-[1.2rem]"
															role="alert"
															aria-live="assertive">
															{errMsg}
														</motion.p>
													)}
												</AnimatePresence>
											</div>
											{peopleList?.map((usr, index) => (
												<div key={usr.id}>
													<div className="flex w-[84%] mx-auto justify-between my-[1.2rem]">
														<div className="flex items-center">
															<div className="w-[3.2rem] h-[3.2rem] mob88:w-[2.4rem] mob88:h-[2.4rem] rounded-full border-[1px] border-gray-300 mr-[1.6rem]">
																<Image
																	width={0}
																	height={0}
																	placeholder="empty"
																	className="rounded-full object-cover w-full h-full"
																	src={
																		usr.picture
																	}
																	alt={`${usr.username} picture`}
																/>
															</div>
															<nav
																className={`text-clamp7 mob88:text-[1.5rem] hover:text-appturq active:text-appturq ${
																	clickedBtn ===
																		index &&
																	usrLinkEffect &&
																	"animate-resizeBtn"
																}`}
																onClick={() => {
																	setClickedBtn(
																		index
																	);
																	usrProfileLnk();
																}}
																onAnimationEnd={() =>
																	setUsrLinkEffect(
																		false
																	)
																}>
																<a
																	className="block px-[0.5rem]"
																	href={`/csian/${[
																		usr.id,
																	]}`}>
																	{
																		usr.username
																	}
																</a>
															</nav>
														</div>
														<MeetFollow
															usr={usr}
															session={
																props.session
															}
															setAllFollowers={
																props.setAllFollowers
															}
															setAllFollowings={
																props.setAllFollowings
															}
															setErrMsg={
																setErrMsg
															}
														/>
													</div>
												</div>
											))}
										</div>
									</FocusOn>
								</div>
							</motion.section>
						)}
					</AnimatePresence>
				</>
			)}
			{isBiggerDevice && (
				<>
					<div className="flex flex-col border-2 border-apppastgreen dark:border-applightdark bg-apppastgreen dark:bg-applightdark pt-[0.8rem] pb-[1.4rem] rounded-2xl shadow-neatcard w-[94%]">
						<h2 className="text-center uppercase text-clamp5 mob88:text-clamp7 my-[1rem] font-semibold">
							Socialize
						</h2>
						<div className="flex justify-center items-center">
							<AnimatePresence>
								{errMsg && (
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
										className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6 my-[1.2rem]"
										role="alert"
										aria-live="assertive">
										{errMsg}
									</motion.p>
								)}
							</AnimatePresence>
						</div>
						{peopleList?.map((usr, index) => (
							<div key={usr.id}>
								<div className="flex w-[84%] mx-auto justify-between my-[1.2rem]">
									<div className="flex items-center">
										<div className="w-[3.2rem] h-[3.2rem] mob88:w-[2.4rem] mob88:h-[2.4rem] rounded-full border-[1px] border-gray-300 mr-[1.6rem]">
											<Image
												width={0}
												height={0}
												placeholder="empty"
												className="rounded-full object-cover w-full h-full"
												src={usr.picture}
												alt={`${usr.username} picture`}
											/>
										</div>
										<nav
											className={`text-clamp7 mob88:text-[1.5rem] hover:text-appturq active:text-appturq ${
												clickedBtn === index &&
												usrLinkEffect &&
												"animate-resizeBtn"
											}`}
											onClick={() => {
												setClickedBtn(index);
												usrProfileLnk();
											}}
											onAnimationEnd={() =>
												setUsrLinkEffect(false)
											}>
											<a
												className="block px-[0.5rem]"
												href={`/csian/${[usr.id]}`}>
												{usr.username}
											</a>
										</nav>
									</div>
									<MeetFollow
										usr={usr}
										session={props.session}
										setAllFollowers={props.setAllFollowers}
										setAllFollowings={
											props.setAllFollowings
										}
										setErrMsg={setErrMsg}
									/>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
}

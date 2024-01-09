"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ChatInput from "./chatInput";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export default function ChatContainer({
	currentChat,
	socket,
	setCurrentChat,
	setSelectedUser,
}) {
	const axiosAuth = useAxiosAuth();
	const { data: session } = useSession();
	const [messages, setMessages] = useState([]);
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [delBtnEffect, setDelBtnEffect] = useState(false);
	const scrollRef = useRef();

	useEffect(() => {
		if (session?.user) {
			const getChatMessages = async () => {
				const data = {
					user_id: currentChat.id,
					sender_id: session.user.user_id,
				};
				const response = await axiosAuth({
					method: "post",
					url: "/messages/getmsgs",
					data: data,
				});
				console.log("client msgs : ", response.data);
				setMessages(response.data);
			};
			getChatMessages();
		}
	}, [currentChat, session, axiosAuth]);

	const handleSendMsg = async (msg) => {
		await axiosAuth.post(`/messages/addmsg`, {
			user_id: currentChat.id,
			sender_id: session.user.user_id,
			body: msg,
		});
		socket.current.emit("send-msg", {
			user_id: currentChat.id,
			sender_id: session.user.user_id,
			body: msg,
		});

		const msgs = [...messages];
		msgs.push({
			fromSelf: true,
			body: msg,
			createdAt: new Date(),
		});
		setMessages(msgs);
	};

	useEffect(() => {
		if (socket.current) {
			console.log("sock curr", socket.current.id);
			socket.current.on("msg-receive", (msg) => {
				console.log("msg arrival", { msg });
				console.log(
					"msg current chat id && msg user id : ",
					currentChat?.id,
					msg?.sender_id
				);
				if (currentChat?.id === msg.sender_id) {
					setArrivalMessage({
						fromSelf: false,
						body: msg.body,
						createdAt: new Date(),
					});
				} else {
					setArrivalMessage(null);
				}
			});
		}
	}, [socket, currentChat, messages]);

	useEffect(() => {
		arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
		console.log("scrollRef : ", scrollRef.current);
	}, [messages]);

	const deleteChat = async () => {
		setDelBtnEffect(true);
		try {
			if (session?.user) {
				const data = {
					user_id: currentChat?.id,
					sender_id: session?.user?.user_id,
				};
				let answer = window.confirm(
					"Are you sure you want to delete these chat messages?"
				);
				if (answer) {
					const resp = await axiosAuth({
						method: "delete",
						url: "/messages/del",
						data: data,
					});
					console.log("del resp : ", resp);
					setCurrentChat(undefined);
					setSelectedUser(undefined);
				}
			}
		} catch (err) {
			console.log("error delete chat", err);
		}
	};

	console.log(
		"curr chat nd user session : ",
		currentChat?.id,
		session?.user?.user_id
	);

	return (
		<div className="relative grid grid-rows-[10%_78%_12%] gap-[0.1rem] overflow-hidden">
			<div className="grid grid-cols-[70%_30%] justify-between items-center px-[1.5rem] shadow-bottomlinelight">
				<div className="flex items-center gap-[1rem]">
					<div className="">
						<Image
							width={0}
							height={0}
							placeholder="empty"
							src={currentChat.picture}
							alt={`${currentChat.username} picture`}
							className="w-[4rem] aspect-square object-cover rounded-full border-2 border-appmauvedark drop-shadow-linkTxt"
						/>
					</div>
					<div className="">
						<h3 className="text-clamp7 font-semibold text-appmauvedark drop-shadow-lighter">
							{currentChat.username}
						</h3>
					</div>
				</div>
				<div className="flex justify-end items-center gap-[2rem] text-clamp1 text-white font-semibold">
					<button
						className={`py-[0.3rem] px-[0.6rem] shadow-neatcard rounded-lg bg-appred hover:opacity-50 ${
							delBtnEffect && "animate-pressed"
						}`}
						onClick={() => deleteChat()}
						onAnimationEnd={() => setDelBtnEffect(false)}>
						Delete
					</button>
				</div>
			</div>

			{/* messages */}
			<div className="py-[1rem] px-[2rem] flex flex-col gap-[1.5rem] overflow-auto">
				{messages &&
					messages?.map((msg, index, arr) => {
						const prevMsg = arr[index - 1];
						const mTime = moment(msg?.createdAt)
							.calendar()
							.split(" at ")[1];
						const pmDate = moment(prevMsg?.createdAt)
							.calendar()
							.split(" at ")[0];
						const mDate = moment(msg?.createdAt)
							.calendar()
							.split(" at ")[0];
						return (
							<div key={uuidv4()} ref={scrollRef} className="">
								<div className="text-[1.2rem] font-extralight text-center m-[0.6rem]">
									{prevMsg &&
									moment(msg?.createdAt).calendar() ==
										moment(prevMsg?.createdAt).calendar()
										? ""
										: prevMsg && mDate == pmDate
										? mTime
										: moment(msg?.createdAt).calendar()}
								</div>
								<div
									className={`flex items-center ${
										msg.fromSelf
											? "justify-end"
											: "justify-start"
									}`}>
									<div
										className={`relative max-w-[92%] break-words px-[1rem] py-[0.5rem] text-clamp1 rounded-[1rem] ${
											msg.fromSelf
												? "bg-teal-300/40 shadow-[-8px_7px_8px_-3px_rgba(0,0,0,0.25)]"
												: "bg-indigo-300/70 shadow-[8px_7px_8px_-3px_rgba(0,0,0,0.25)]"
										}`}>
										<div
											className={`${
												msg.fromSelf
													? "absolute right-[-8px] top-[35%] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-0 border-l-[8px] border-l-teal-300/40"
													: "absolute left-[-8px] top-[35%] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-0 border-r-[8px] border-r-indigo-300/70"
											}`}></div>
										<p>{msg.body}</p>
									</div>
								</div>
							</div>
						);
					})}
			</div>

			{/* new message input */}
			<ChatInput handleSendMsg={handleSendMsg} />
		</div>
	);
}

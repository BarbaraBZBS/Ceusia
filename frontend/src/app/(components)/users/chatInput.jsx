"use client";
import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({ handleSendMsg }) {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [msg, setMsg] = useState("");
	const [btnClickEffect, setBtnClickEffect] = useState(false);
	const [emojiBtnClickEffect, setEmojiBtnClickEffect] = useState(false);
	const isDisabled = !msg;
	const isBrowser = () => typeof window !== "undefined";

	//handle automatic input resize
	if (!isBrowser()) return;
	document.querySelectorAll("textarea").forEach((element) => {
		element.style.height = `${element.scrollHeight}px`;
		element.addEventListener("input", (event) => {
			event.target.style.height = "auto";
			event.target.style.height = `${event.target.scrollHeight}px`;
		});
	});

	//show or hide emoji picker function
	const handleEmojiPickerHideShow = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	//manage clicking emoji function
	const handleEmojiClick = (emoji) => {
		let message = msg;
		message += emoji.emoji;
		setMsg(message);
	};

	//submit sending message
	const sendChat = (event) => {
		event.preventDefault();
		setBtnClickEffect(true);
		if (msg.length > 0) {
			setShowEmojiPicker(false);
			handleSendMsg(msg);
			setMsg("");
			setBtnClickEffect(false);
		}
	};

	//manage how emoji picker is opened
	const handleShowEmoji = () => {
		setEmojiBtnClickEffect(true);
		setTimeout(() => {
			handleEmojiPickerHideShow();
		}, 400);
	};

	return (
		<div className="grid grid-cols-[8%_92%] items-center pl-[1.4rem] pb-[0.3rem] text-clamp1 gap-[0.8rem] shadow-toplinelight">
			<div className="flex items-center gap-[1rem]">
				<div className="relative">
					<BsEmojiSmileFill
						tabIndex={0}
						title={
							showEmojiPicker
								? "hide emoji picker"
								: "show emoji picker"
						}
						className={`text-[2.3rem] mob88:text-[2rem] text-yellow-300 bg-black rounded-full cursor-pointer drop-shadow-linkTxt ${
							emojiBtnClickEffect && "animate-pressed"
						}`}
						onClick={() => {
							handleShowEmoji();
						}}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								handleShowEmoji();
							}
						}}
						onAnimationEnd={() => setEmojiBtnClickEffect(false)}
					/>
					{showEmojiPicker && (
						<div className="fixed bottom-[10.6rem] sm:bottom-[14.6rem] lg:bottom-[17.6rem] left-[50%] sm:left-[64%] translate-x-[-50%] z-20">
							<Picker
								onEmojiClick={handleEmojiClick}
								className="bg-appmauvedark"
							/>
						</div>
					)}
				</div>
			</div>
			<form
				className="relative bg-appsand dark:bg-appstone h-[2.6rem] w-[95%] rounded-[20px] flex content-center gap-[2rem]"
				onSubmit={(e) => sendChat(e)}>
				<textarea
					rows={1}
					value={msg}
					onChange={(e) => setMsg(e.target.value)}
					placeholder="your message"
					className="absolute bottom-0 min-h-[2.6rem] w-[82%] bg-appsand dark:bg-appstone leading-[2.6rem] rounded-[25px] px-[1rem] focus:outline-none resize-none selection:bg-appmauvelight"
				/>
				<button
					aria-label="send message"
					aria-disabled={isDisabled}
					className={`absolute bottom-0 right-0 py-[0.35rem] mb-[-0.05rem] pl-[1.2rem] pr-[0.8rem] rounded-[20px] flex justify-center items-center bg-appmauvedark dark:bg-appmauvedarker mr-[-1px] ${
						btnClickEffect && "animate-pressed"
					} ${
						isDisabled
							? "opacity-30 cursor-not-allowed"
							: "hover:opacity-50"
					}`}
					onAnimationEnd={() => {
						setBtnClickEffect(false);
					}}
					onClick={(e) => {
						isDisabled && e.preventDefault();
					}}>
					<IoMdSend className="text-[2rem] text-apppastgreen drop-shadow-light" />
				</button>
			</form>
		</div>
	);
}

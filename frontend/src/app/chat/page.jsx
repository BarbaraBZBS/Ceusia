"use client";
import React, { useContext, useEffect } from "react";
import Contacts from "../(components)/users/contacts";
import { useSession } from "next-auth/react";
import StartChat from "../(components)/users/startChat";
import ChatContainer from "../(components)/users/chatContainer";
import { PageWrap } from "../(components)/motions/pageWrap";
import { ChatContext } from "../(components)/ChatContext";

export default function Chat() {
	const { data: session } = useSession();
	const {
		socket,
		currentChat,
		setCurrentChat,
		handleChatChange,
		selectedUser,
		setSelectedUser,
	} = useContext(ChatContext);

	useEffect(() => {
		if (!currentChat) {
			setSelectedUser(undefined);
		}
	}, [socket, currentChat, setSelectedUser]);

	console.log("socket provider : ", socket);
	console.log("chat, session : ", currentChat, session?.user?.user_id);
	return (
		<PageWrap>
			<div className="flex flex-col w-screen h-[90vh] justify-center items-center mb-[2.4rem]">
				<div className="w-[96%] h-[97%] bg-apppinklighter grid grid-cols-[28%_72%] translate-x-0 shadow-neatcard rounded-xl">
					<Contacts
						session={session}
						changeChat={handleChatChange}
						selectedUser={selectedUser}
						setSelectedUser={setSelectedUser}
					/>
					{currentChat === undefined ? (
						<StartChat session={session} />
					) : (
						<ChatContainer
							socket={socket}
							currentChat={currentChat}
							setCurrentChat={setCurrentChat}
							setSelectedUser={setSelectedUser}
						/>
					)}
				</div>
			</div>
		</PageWrap>
	);
}

"use client";
import React, {
	useState,
	useEffect,
	createContext,
	useRef,
	useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
	const { data: session } = useSession();
	const socket = useRef();
	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState(undefined);
	const [selectedUser, setSelectedUser] = useState(undefined);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [isDesiredChat, setIsDesiredChat] = useState(undefined);
	const [newN, setNewN] = useState(false);

	//console.log("online users : ", onlineUsers);
	//console.log("notifications ??? : ", notifications);

	//handle socket connection
	useEffect(() => {
		socket.current = io("http://localhost:8000");
	}, [socket]);

	//handle online users for socket
	useEffect(() => {
		if (socket.current && session?.user) {
			socket.current.emit("add-new-user", session?.user?.user_id);
			socket.current.on("getOnlineUsers", (res) => {
				//console.log("online users res : ", res);
				setOnlineUsers(res);
			});
			return () => {
				socket.current.off("getOnlineUsers");
			};
		}
	}, [socket, session]);

	//handle change current chat
	const handleChatChange = (chat) => {
		setCurrentChat(chat);
	};

	//handle socket notifications
	useEffect(() => {
		if (socket.current) {
			socket.current.on("getNotification", (res) => {
				//console.log("notifications ?? : ", { res });
				if (res.sender_id === session?.user?.user_id) return;
				if (!res?.post_id) {
					const isChatOpen = currentChat?.id === res.sender_id;
					if (isChatOpen) {
						setNotifications((prev) => [
							{ ...res, isRead: true },
							...prev,
						]);
					} else {
						setNewN(true);
						setNotifications((prev) => [res, ...prev]);
					}
				} else {
					setNewN(true);
					setNotifications((prev) => [res, ...prev]);
				}
			});
			return () => {
				socket.current.off("getNotification");
			};
		}
	}, [socket, currentChat, session]);

	//mark all notifications on click function
	const markAllAsRead = useCallback((notifications) => {
		const markedNotifications = notifications.map((n) => {
			return { ...n, isRead: true };
		});
		setNotifications(markedNotifications);
	}, []);

	//mark chat notification as read
	const markAsRead = useCallback((notification, notifications, contacts) => {
		let index = 0;
		const desiredChat = contacts.find((chat) => {
			const getIndex = (chat) => chat?.id === notification.sender_id;
			index = contacts.findIndex(getIndex);
			return chat?.id === notification?.sender_id;
		});

		const markedNotifications = notifications.map((ele) => {
			if (notification.sender_id === ele.sender_id) {
				return { ...notification, isRead: true };
			} else {
				return ele;
			}
		});

		handleChatChange(desiredChat, index);
		setCurrentChat(desiredChat);
		setIsDesiredChat(desiredChat);
		setSelectedUser(index);
		setNotifications(markedNotifications);
	}, []);

	//mark notification as read for other than chat notifications
	const markPostNotifAsRead = useCallback((notification, notifications) => {
		const markedNotifications = notifications.map((ele) => {
			if (notification.sender_id === ele.sender_id) {
				return { ...notification, isRead: true };
			} else {
				return ele;
			}
		});
		setNotifications(markedNotifications);
	}, []);

	//mark notification as read for contacts when opening chat
	const markUserAllAsRead = useCallback(
		(userNotifications, notifications) => {
			const mNotifications = notifications.map((ele) => {
				let notification;

				userNotifications.forEach((n) => {
					if (n.sender_id === ele.sender_id) {
						notification = { ...n, isRead: true };
					} else {
						notification = ele;
					}
				});
				return notification;
			});
			setNotifications(mNotifications);
		},
		[]
	);

	return (
		<ChatContext.Provider
			value={{
				socket,
				contacts,
				setContacts,
				selectedUser,
				setSelectedUser,
				currentChat,
				onlineUsers,
				setCurrentChat,
				notifications,
				setNotifications,
				handleChatChange,
				markAllAsRead,
				markAsRead,
				markPostNotifAsRead,
				markUserAllAsRead,
				isDesiredChat,
				newN,
				setNewN,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

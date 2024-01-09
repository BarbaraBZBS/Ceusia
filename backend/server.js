import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { app } from "./app.js";
import { Server } from "socket.io";

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}!`);
});
app.set("port", port);

const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

server.listen(port);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
	socket.on("add-new-user", (userId) => {
		!onlineUsers.has(userId) && onlineUsers.set(userId, socket.id);

		let onlUsrs = Array.from(onlineUsers, ([userId, socketId]) => ({
			userId,
			socketId,
		}));
		//console.log("socket users : ", onlineUsers);
		io.emit("getOnlineUsers", onlUsrs);
	});

	socket.on("disconnect", () => {
		const indexFinder = (socketId) => socketId === socket.id;
		const onlineUsrsValues = onlineUsers.values();
		const foundValue = Array.from(onlineUsrsValues).findIndex(indexFinder);
		onlineUsers.delete(Array.from(onlineUsers.keys())[foundValue]);
		let onlUsrs = Array.from(onlineUsers, ([userId, socketId]) => ({
			userId,
			socketId,
		}));
		io.emit("getOnlineUsers", onlUsrs);
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.user_id);
		console.log("data msg sent : ", data);
		console.log("sendUserSocket", sendUserSocket);
		if (sendUserSocket) {
			io.to(sendUserSocket).emit("msg-receive", data);
			io.to(sendUserSocket).emit("getNotification", {
				sender_id: data.sender_id,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("like-post", (data) => {
		const likeUserSocket = onlineUsers.get(data.user_id);
		console.log("data like post : ", data);
		console.log("likeUserSocket", likeUserSocket);
		if (likeUserSocket) {
			io.to(likeUserSocket).emit("post-liked", data);
			io.to(likeUserSocket).emit("getNotification", {
				post_id: data.post_id,
				liked: true,
				sender_id: data.sender_id,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("dislike-post", (data) => {
		const likeUserSocket = onlineUsers.get(data.user_id);
		console.log("data like post : ", data);
		console.log("likeUserSocket", likeUserSocket);
		if (likeUserSocket) {
			io.to(likeUserSocket).emit("post-liked", data);
			io.to(likeUserSocket).emit("getNotification", {
				post_id: data.post_id,
				disliked: true,
				sender_id: data.sender_id,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("comment-post", (data) => {
		const commentUserSocket = onlineUsers.get(data.user_id);
		console.log("data comment post : ", data);
		console.log("commentUserSocket", commentUserSocket);
		if (commentUserSocket) {
			io.to(commentUserSocket).emit("post-commented", data);
			io.to(commentUserSocket).emit("getNotification", {
				post_id: data.post_id,
				sender_id: data.sender_id,
				comment_id: data.comment_id,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("like-comment", (data) => {
		const likeCommentUserSocket = onlineUsers.get(data.user_id);
		console.log("data like comment : ", data);
		console.log("likeCommentUserSocket", likeCommentUserSocket);
		if (likeCommentUserSocket) {
			io.to(likeCommentUserSocket).emit("comment-liked", data);
			io.to(likeCommentUserSocket).emit("getNotification", {
				post_id: data.post_id,
				commentLiked: true,
				comment_id: data.comment_id,
				sender_id: data.sender_id,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("dislike-comment", (data) => {
		const dislikeCommentUserSocket = onlineUsers.get(data.user_id);
		console.log("data dislike comment : ", data);
		console.log("dislikeCommentUserSocket", dislikeCommentUserSocket);
		if (dislikeCommentUserSocket) {
			io.to(dislikeCommentUserSocket).emit("comment-disliked", data);
			io.to(dislikeCommentUserSocket).emit("getNotification", {
				post_id: data.post_id,
				commentDisliked: true,
				comment_id: data.comment_id,
				sender_id: data.sender_id,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("follow", (data) => {
		const followUserSocket = onlineUsers.get(data.user_id);
		console.log("data follow : ", data);
		console.log("followUserSocket", followUserSocket);
		if (followUserSocket) {
			io.to(followUserSocket).emit("user-followed", data);
			io.to(followUserSocket).emit("getNotification", {
				sender_id: data.sender_id,
				followed: true,
				isRead: false,
				date: new Date(),
			});
		}
	});
});

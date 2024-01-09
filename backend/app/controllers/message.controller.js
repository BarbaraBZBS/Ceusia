import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const createMessage = async (req, res, next) => {
	const { user_id, sender_id, body } = req.body;
	try {
		User.findOne({ where: { id: user_id } }).then(async (user) => {
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			} else {
				await Message.create({
					user_id: user.id,
					sender_id: sender_id,
					body: body,
					logged_user: sender_id,
				}).then((msg) => {
					console.log("success: msg sent");
					res.status(201).json(msg);
				});
			}
		});
	} catch (err) {
		console.log(err);
		console.log("error: msg not created");
		res.status(400).json({ message: "message creation error" });
	}
};

const getAllMessages = (req, res, next) => {
	const { user_id, sender_id } = req.body;
	try {
		User.findOne({ where: { id: user_id } }).then(async (user) => {
			if (!user) {
				return res.status(404).json({ message: "user not found" });
			} else {
				await Message.findAll({
					where: {
						user_id: [user.id, sender_id],
						sender_id: [sender_id, user.id],
					},
					order: [["createdAt", "ASC"]],
				}).then((messages) => {
					if (!messages) {
						return res.status(400).json({
							message: "unable to retrieve messages",
						});
					} else {
						//console.log("messages : ", messages);
						let alteredMessages = messages.map((message) => {
							return {
								fromSelf: message.logged_user === sender_id,
								body: message.body,
								createdAt: message.createdAt,
							};
						});
						res.status(200).json(alteredMessages);
					}
				});
			}
		});
	} catch (err) {
		res.status(500).json({ err });
	}
};

//const updateMsgOnRead = () => {
//	Message.findByPK(req.params.id).then(async (message) => {
//		if (!message) {
//			return res.status(404).json({ message: "msg not found" });
//		} else {
//			await message
//				.update({
//					marked_as_read: true,
//				})
//				.then(() => {
//					console.log("marked as read");
//					res.status(200).json(message, {
//						message: "user message(s) successfully marked as read",
//					});
//				});
//		}
//	});
//};
//
//const updateAllMsgsAsRead = () => {};

const deleteAllMessages = async (req, res, next) => {
	const { user_id, sender_id } = req.body;
	const loggedUsr = req.auth.user_id;
	const loggedUsrR = req.auth.role;
	try {
		if (
			loggedUsr !== user_id &&
			loggedUsr !== sender_id &&
			loggedUsrR !== "admin"
		) {
			return res.status(401).json({ message: "Unauthorized" });
		} else {
			await Message.destroy({
				where: {
					user_id: [user_id, sender_id],
					sender_id: [sender_id, user_id],
				},
			})
				.then((deleted) => {
					if (deleted > 0) {
						res.status(200).json({
							message: "Chat deleted!",
						});
					}
				})
				.catch((error) => {
					console.log("error del : ", error);
					res.status(400).json({ error });
				});
		}
	} catch (err) {
		console.log("error removing all chat messages", err);
		res.status(500).json({ err });
	}
};

export { createMessage, getAllMessages, deleteAllMessages };

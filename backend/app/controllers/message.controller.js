import Message from "../models/message.model.js";
import User from "../models/user.model.js";

/**
 * Create a message from a sender to a user
 * @date 3/31/2024 - 7:05:58 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
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
					//console.log("success: msg sent");
					return res.status(201).json(msg);
				});
			}
		});
	} catch (err) {
		console.log(err);
		console.log("error: msg not created");
		res.status(400).json({ message: "message creation error" });
	}
};

/**
 * Read all messages between 2 users
 * @date 3/31/2024 - 7:05:58 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
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
						return res.status(200).json(alteredMessages);
					}
				});
			}
		});
	} catch (err) {
		res.status(500).json({ err });
	}
};

/** Update a message to read */
//(managed with socket.io)
//const updateMsgOnRead = () => {};

/** Update all messages to read */
//(managed with socket.io)
//const updateAllMsgsAsRead = () => {};

/**
 * Delete all messages between 2 users
 * @date 3/31/2024 - 8:32:33 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
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
						return res.status(200).json({
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

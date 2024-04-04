import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import LikeComment from "../models/likeComment.model.js";
import DislikeComment from "../models/dislikeComment.model.js";
import { db } from "../models/db.js";

/**
 * Create or delete a comment like
 * @date 3/31/2024 - 6:12:11 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const likeComment = async (req, res) => {
	const userId = req.auth.user_id;
	const commentId = req.params.cid;
	//console.log(commentId);
	//console.log(userId);

	if (commentId <= 0) {
		return res.status(400).json({ message: "invalid parameters" });
	}
	Comment.findOne({ where: { id: commentId } }).then((comment) => {
		//console.log("post found: ", comment);
		if (!comment)
			return res.status(404).json({ message: "post not found" });
	});

	User.findOne({ where: { id: userId } }).then((user) => {
		//console.log("user found: ", user.username);
		if (!user) return res.status(404).json({ message: "user not found" });
	});

	LikeComment.findOne({
		where: { comment_id: commentId, user_id: userId },
	}).then(async (alreadyLiked) => {
		if (alreadyLiked) {
			await LikeComment.destroy({
				where: { comment_id: commentId, user_id: userId },
			})
				.then(() => {
					Comment.findOne({ where: { id: commentId } })
						.then(async (comment) => {
							await comment.update({
								likes: db.literal("likes - 1"),
							});
							return res.status(200).json({
								message: "comment unliked",
							});
						})
						.catch((error) => res.status(400).json(error));
				})
				.catch((error) => {
					console.log("error : ", error);
					res.status(404).json({ error });
				});
		} else {
			DislikeComment.findOne({
				where: { comment_id: commentId, user_id: userId },
			}).then(async (disliked) => {
				if (disliked) {
					await DislikeComment.destroy({
						where: { comment_id: commentId, user_id: userId },
					}).then(() => {
						Comment.findOne({ where: { id: commentId } })
							.then(async (comment) => {
								await comment.update({
									dislikes: db.literal("dislikes - 1"),
								});
								//console.log("comment undisliked");
							})
							.catch((err) => {
								res.status(400).json({ err });
							});
					});
				}
				await LikeComment.create({
					comment_id: commentId,
					user_id: userId,
				})
					.then(() => {
						Comment.findOne({ where: { id: commentId } })
							.then(async (comment) => {
								await comment.update({
									likes: db.literal("likes + 1"),
								});
								return res.status(201).json({
									message: "comment liked",
								});
							})
							.catch((error) => res.status(400).json({ error }));
					})
					.catch((error) => {
						res.status(404).json({ error });
					});
			});
		}
	});
};

/**
 * Create or delete a comment dislike
 * @date 3/31/2024 - 6:12:11 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const dislikeComment = async (req, res) => {
	const userId = req.auth.user_id;
	const commentId = req.params.cid;
	//console.log(commentId);
	//console.log(userId);

	if (commentId <= 0) {
		return res.status(400).json({ message: "invalid parameters" });
	}
	Comment.findOne({ where: { id: commentId } }).then((comment) => {
		//console.log("comment found: ", comment);
		if (!comment)
			return res.status(404).json({ message: "comment not found" });
	});

	User.findOne({ where: { id: userId } }).then((user) => {
		//console.log("user found: ", user.username);
		if (!user) return res.status(404).json({ message: "user not found" });
	});

	DislikeComment.findOne({
		where: { comment_id: commentId, user_id: userId },
	}).then(async (alreadyDisliked) => {
		if (alreadyDisliked) {
			await DislikeComment.destroy({
				where: { comment_id: commentId, user_id: userId },
			})
				.then(() => {
					Comment.findOne({ where: { id: commentId } })
						.then(async (comment) => {
							await comment.update({
								dislikes: db.literal("dislikes - 1"),
							});
							return res.status(200).json({
								message: "comment undisliked",
							});
						})
						.catch((error) => res.status(400).json(error));
				})
				.catch((error) => {
					console.log("error : ", error);
					res.status(404).json({ error });
				});
		} else {
			LikeComment.findOne({
				where: { comment_id: commentId, user_id: userId },
			}).then(async (liked) => {
				if (liked) {
					await LikeComment.destroy({
						where: { comment_id: commentId, user_id: userId },
					}).then(() => {
						Comment.findOne({ where: { id: commentId } })
							.then(async (comment) => {
								await comment.update({
									likes: db.literal("likes - 1"),
								});
								//console.log("comment unliked");
							})
							.catch((err) => {
								res.status(400).json({ err });
							});
					});
				}
				await DislikeComment.create({
					comment_id: commentId,
					user_id: userId,
				})
					.then(() => {
						Comment.findOne({ where: { id: commentId } })
							.then(async (comment) => {
								await comment.update({
									dislikes: db.literal("dislikes + 1"),
								});
								return res.status(201).json({
									message: "comment disliked",
								});
							})
							.catch((error) => res.status(400).json({ error }));
					})
					.catch((error) => {
						res.status(404).json({ error });
					});
			});
		}
	});
};

/**
 * Read comment liked and disliked status
 * @date 3/31/2024 - 6:12:11 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const commentLikedDisliked = (req, res, next) => {
	const comment_id = req.body.comment_id;
	const user_id = req.auth.user_id;
	LikeComment.findOne({ where: { comment_id: comment_id, user_id: user_id } })
		.then((liked) => {
			if (liked) {
				return res
					.status(200)
					.json({ message: "comment liked: ", liked });
			} else {
				DislikeComment.findOne({
					where: { comment_id: comment_id, user_id: user_id },
				}).then((disliked) => {
					if (disliked) {
						return res.status(200).json({
							message: "comment disliked: ",
							disliked,
						});
					} else {
						return res.status(200).json({
							message: "comment neither liked nor disliked",
						});
					}
				});
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

export { likeComment, dislikeComment, commentLikedDisliked };

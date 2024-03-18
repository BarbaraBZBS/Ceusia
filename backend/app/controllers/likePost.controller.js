import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Likepost from "../models/likePost.model.js";
import Dislikepost from "../models/dislikePost.model.js";
import { db } from "../models/db.js";

//like post
const likePost = async (req, res) => {
	const userId = req.auth.user_id;
	const postId = req.params.id;

	if (postId <= 0) {
		return res.status(400).json({ message: "invalid parameters" });
	}
	Post.findOne({ where: { id: postId } }).then((post) => {
		console.log("post found: ", post);
	});

	User.findOne({ where: { id: userId } }).then((user) => {
		console.log("user found: ", user.username);
	});

	Likepost.findOne({ where: { post_id: postId, user_id: userId } }).then(
		async (alreadyLiked) => {
			if (alreadyLiked) {
				await Likepost.destroy({
					where: { post_id: postId, user_id: userId },
				})
					.then(() => {
						Post.findOne({ where: { id: postId } })
							.then(async (post) => {
								await post.update({
									likes: db.literal("likes - 1"),
								});
								res.status(200).json({
									message: "post unliked !",
								});
							})
							.catch((error) => res.status(400).json(error));
					})
					.catch((error) => {
						console.log("error : ", error);
						res.status(404).json({ error });
					});
			} else {
				Dislikepost.findOne({
					where: { post_id: postId, user_id: userId },
				}).then(async (disliked) => {
					if (disliked) {
						await Dislikepost.destroy({
							where: { post_id: postId, user_id: userId },
						}).then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										dislikes: db.literal("dislikes - 1"),
									});
									console.log("post dislike removed");
								})
								.catch((err) => {
									res.status(400).json({ err });
								});
						});
					}
					await Likepost.create({
						post_id: postId,
						user_id: userId,
					})
						.then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										likes: db.literal("likes + 1"),
									});
									res.status(201).json({
										message: "post liked !",
									});
								})
								.catch((error) =>
									res.status(400).json({ error })
								);
						})
						.catch((error) => {
							res.status(404).json({ error });
						});
				});
			}
		}
	);
	console.log(postId);
	console.log(userId);
};

//dislike post
const dislikePost = async (req, res) => {
	const userId = req.auth.user_id;
	const postId = req.params.id;

	if (postId <= 0) {
		return res.status(400).json({ message: "invalid parameters" });
	}
	Post.findOne({ where: { id: postId } }).then((post) => {
		console.log("post found: ", post);
	});

	User.findOne({ where: { id: userId } }).then((user) => {
		console.log("user found: ", user.username);
	});

	Dislikepost.findOne({ where: { post_id: postId, user_id: userId } }).then(
		async (alreadyDisliked) => {
			if (alreadyDisliked) {
				await Dislikepost.destroy({
					where: { post_id: postId, user_id: userId },
				})
					.then(() => {
						Post.findOne({ where: { id: postId } })
							.then(async (post) => {
								await post.update({
									dislikes: db.literal("dislikes - 1"),
								});
								res.status(200).json({
									message: "post dislike removed !",
								});
							})
							.catch((error) => res.status(400).json(error));
					})
					.catch((error) => {
						console.log("error : ", error);
						res.status(404).json({ error });
					});
			} else {
				Likepost.findOne({
					where: { post_id: postId, user_id: userId },
				}).then(async (liked) => {
					if (liked) {
						await Likepost.destroy({
							where: { post_id: postId, user_id: userId },
						}).then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										likes: db.literal("likes - 1"),
									});
									console.log("post unliked");
								})
								.catch((err) => {
									res.status(400).json({ err });
								});
						});
					}
					await Dislikepost.create({
						post_id: postId,
						user_id: userId,
					})
						.then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										dislikes: db.literal("dislikes + 1"),
									});
									res.status(201).json({
										message: "post disliked !",
									});
								})
								.catch((error) =>
									res.status(400).json({ error })
								);
						})
						.catch((error) => {
							res.status(404).json({ error });
						});
				});
			}
		}
	);
	console.log(postId);
	console.log(userId);
};

//like dislike display
const postLikedDisliked = (req, res, next) => {
	const post_id = req.body.post_id;
	const user_id = req.auth.user_id;
	Likepost.findOne({ where: { post_id: post_id, user_id: user_id } })
		.then((liked) => {
			if (liked) {
				res.status(200).json({ message: "liked: ", liked });
			} else {
				console.log("not liked");
				Dislikepost.findOne({
					where: { post_id: post_id, user_id: user_id },
				}).then((disliked) => {
					if (disliked) {
						res.status(200).json({
							message: "disliked: ",
							disliked,
						});
					} else {
						console.log("not disliked");
						res.status(200).json({ message: "none found" });
					}
				});
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

export { likePost, dislikePost, postLikedDisliked };

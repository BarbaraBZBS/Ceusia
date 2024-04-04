import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import LikePost from "../models/likePost.model.js";
import DislikePost from "../models/dislikePost.model.js";
import { db } from "../models/db.js";

/**
 * Create or delete a post like
 * @date 3/31/2024 - 7:02:11 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const likePost = async (req, res) => {
	const userId = req.auth.user_id;
	const postId = req.params.id;
	//console.log(postId);
	//console.log(userId);

	if (postId <= 0) {
		return res.status(400).json({ message: "invalid parameters" });
	}
	Post.findOne({ where: { id: postId } }).then((post) => {
		//console.log("post found: ", post);
		if (!post) return res.status(404).json({ message: "post not found" });
	});

	User.findOne({ where: { id: userId } }).then((user) => {
		//console.log("user found: ", user.username);
		if (!user) return res.status(404).json({ message: "user not found" });
	});

	LikePost.findOne({ where: { post_id: postId, user_id: userId } }).then(
		async (alreadyLiked) => {
			if (alreadyLiked) {
				await LikePost.destroy({
					where: { post_id: postId, user_id: userId },
				})
					.then(() => {
						Post.findOne({ where: { id: postId } })
							.then(async (post) => {
								await post.update({
									likes: db.literal("likes - 1"),
								});
								return res.status(200).json({
									message: "post unliked",
								});
							})
							.catch((error) => res.status(400).json(error));
					})
					.catch((error) => {
						console.log("error : ", error);
						res.status(404).json({ error });
					});
			} else {
				DislikePost.findOne({
					where: { post_id: postId, user_id: userId },
				}).then(async (disliked) => {
					if (disliked) {
						await DislikePost.destroy({
							where: { post_id: postId, user_id: userId },
						}).then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										dislikes: db.literal("dislikes - 1"),
									});
									//console.log("post undisliked");
								})
								.catch((err) => {
									res.status(400).json({ err });
								});
						});
					}
					await LikePost.create({
						post_id: postId,
						user_id: userId,
					})
						.then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										likes: db.literal("likes + 1"),
									});
									return res.status(201).json({
										message: "post liked",
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
};

/**
 * Create or delete a post dislike
 * @date 3/31/2024 - 7:02:11 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const dislikePost = async (req, res) => {
	const userId = req.auth.user_id;
	const postId = req.params.id;
	//console.log(postId);
	//console.log(userId);

	if (postId <= 0) {
		return res.status(400).json({ message: "invalid parameters" });
	}
	Post.findOne({ where: { id: postId } }).then((post) => {
		//console.log("post found: ", post);
		if (!post) return res.status(404).json({ message: "post not found" });
	});

	User.findOne({ where: { id: userId } }).then((user) => {
		//console.log("user found: ", user.username);
		if (!user) return res.status(404).json({ message: "user not found" });
	});

	DislikePost.findOne({ where: { post_id: postId, user_id: userId } }).then(
		async (alreadyDisliked) => {
			if (alreadyDisliked) {
				await DislikePost.destroy({
					where: { post_id: postId, user_id: userId },
				})
					.then(() => {
						Post.findOne({ where: { id: postId } })
							.then(async (post) => {
								await post.update({
									dislikes: db.literal("dislikes - 1"),
								});
								return res.status(200).json({
									message: "post undisliked",
								});
							})
							.catch((error) => res.status(400).json(error));
					})
					.catch((error) => {
						console.log("error : ", error);
						res.status(404).json({ error });
					});
			} else {
				LikePost.findOne({
					where: { post_id: postId, user_id: userId },
				}).then(async (liked) => {
					if (liked) {
						await LikePost.destroy({
							where: { post_id: postId, user_id: userId },
						}).then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										likes: db.literal("likes - 1"),
									});
									//console.log("post unliked");
								})
								.catch((err) => {
									res.status(400).json({ err });
								});
						});
					}
					await DislikePost.create({
						post_id: postId,
						user_id: userId,
					})
						.then(() => {
							Post.findOne({ where: { id: postId } })
								.then(async (post) => {
									await post.update({
										dislikes: db.literal("dislikes + 1"),
									});
									return res.status(201).json({
										message: "post disliked",
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
};

/**
 * Read post liked and disliked status
 * @date 3/31/2024 - 7:02:11 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const postLikedDisliked = (req, res, next) => {
	const post_id = req.body.post_id;
	const user_id = req.auth.user_id;
	LikePost.findOne({ where: { post_id: post_id, user_id: user_id } })
		.then((liked) => {
			if (liked) {
				return res.status(200).json({ message: "post liked: ", liked });
			} else {
				DislikePost.findOne({
					where: { post_id: post_id, user_id: user_id },
				}).then((disliked) => {
					if (disliked) {
						return res.status(200).json({
							message: "post disliked: ",
							disliked,
						});
					} else {
						return res.status(200).json({
							message: "post neither liked nor disliked",
						});
					}
				});
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

export { likePost, dislikePost, postLikedDisliked };

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import { db } from "../models/db.js";
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
const pipeline = promisify(stream.pipeline);
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

const createComment = async (req, res, next) => {
	console.log("request body : ", req.body);
	console.log("request file : ", req.file);
	const date = JSON.stringify(Date.now());
	const newD = date.split(date[6]).pop();
	try {
		if (req.file) {
			const nameToFormat = req.file.originalName.split(" ");
			const splittedName = nameToFormat.join("_");
			const fileOriginName = splittedName.split(".")[0];
			if (req.file.detectedMimeType == null) {
				return res.status(403).json({ message: "Bad file type" });
			} else if (!req.file.detectedMimeType.startsWith("image")) {
				return res.status(403).json({ message: "Bad file type" });
			} else if (req.file.size > 8000000) {
				return res.status(409).json({ message: "Max size reached" });
			} else {
				Post.findByPk(req.params.id)
					.then(async (post) => {
						if (!post) {
							return res
								.status(404)
								.json({ message: "post not found" });
						}
						const fileName =
							`${fileOriginName}` +
							`${req.auth.user_id}` +
							`${newD}` +
							req.file.detectedFileExtension;
						console.log("filen: ", fileName);
						const filePath = `/image/${fileName}`;
						//const filePath = `${req.protocol}://${req.get(
						//	"host"
						//)}/image/${fileName}`;
						console.log("image: ", filePath);
						await pipeline(
							req.file.stream,
							fs.createWriteStream(
								path.join(
									__dirname,
									"/public",
									"/files",
									"/comment",
									"/",
									fileName
								)
							)
						);
						await Comment.create({
							post_id: post.id,
							user_id: req.auth.user_id,
							message: req.body.message,
							image: filePath,
						});
						await post.update({
							discussions: db.literal("discussions + 1"),
						});
						res.status(201).json({ message: "comment added" });
					})
					.catch((err) => res.status(400).json({ err }));
			}
		} else {
			Post.findByPk(req.params.id)
				.then(async (post) => {
					if (!post) {
						return res
							.status(404)
							.json({ message: "post not found" });
					}
					await Comment.create({
						post_id: post.id,
						user_id: req.auth.user_id,
						message: req.body.message,
					});
					// console.log( 'message : ', req.body.message )
					await post.update({
						discussions: db.literal("discussions + 1"),
					});
					res.status(201).json({ message: "comment added" });
				})
				.catch((err) => res.status(400).json({ err }));
		}
	} catch (err) {
		console.log("error: post not created", err, res.statusCode);
		res.status(500).json({ message: "error, comment not added" });
	}
};

const getAllPostComments = (req, res, next) => {
	Post.findByPk(req.params.id).then(async (post) => {
		if (!post) {
			return res.status(404).json({ message: "post not found" });
		}
		await Comment.findAll({
			where: { post_id: post.id },
			order: [["createdAt", "ASC"]],
			include: [
				{
					model: User,
					attributes: ["username", "picture"],
				},
				{
					model: Post,
					attributes: ["content"],
				},
			],
		})
			.then((comments) => {
				if (comments) {
					res.status(200).json(comments);
				} else {
					res.status(404).json({ message: "No comments found" });
				}
			})
			.catch((err) => res.status(500).json({ err }));
	});
};

const findOnePostComment = (req, res) => {
	Post.findByPk(req.params.id).then((post) => {
		if (!post) {
			return res.status(404).json({ message: "post not found" });
		}
		Comment.findOne({
			where: { id: req.params.cid, post_id: post.id },
			include: [
				{
					model: User,
					attributes: ["username", "picture"],
				},
				{
					model: Post,
					attributes: ["content"],
				},
			],
		})
			.then((comment) => {
				if (comment) {
					res.status(200).json(comment);
				} else {
					res.status(404).send();
				}
			})
			.catch((err) => res.status(500).json({ err }));
	});
};

const updateComment = (req, res, next) => {
	const date = JSON.stringify(Date.now());
	const newD = date.split(date[6]).pop();

	try {
		Post.findByPk(req.params.id).then(async (post) => {
			if (!post) {
				return res.status(404).json({ message: "post not found" });
			}
			Comment.findOne({ where: { id: req.params.cid, post_id: post.id } })
				.then(async (comment) => {
					if (!comment) {
						return res
							.status(404)
							.json({ message: "comment not found" });
					}
					if (
						req.auth.role != "admin" &&
						comment.user_id != req.auth.user_id
					) {
						return res
							.status(401)
							.json({ message: "Unauthorized" });
					}
					if (req.file) {
						const nameToFormat = req.file.originalName.split(" ");
						const splittedName = nameToFormat.join("_");
						const fileOriginName = splittedName.split(".")[0];
						if (req.file.detectedMimeType === null) {
							return res
								.status(403)
								.json({ message: "Bad file type" });
						} else if (
							!req.file.detectedMimeType.startsWith("image")
						) {
							return res
								.status(403)
								.json({ message: "Bad file type" });
						} else if (req.file.size > 8000000) {
							return res
								.status(409)
								.json({ message: "Max size reached" });
						} else {
							const fileName =
								`${fileOriginName}` +
								`${req.auth.user_id}` +
								`${newD}` +
								req.file.detectedFileExtension;
							if (comment.image) {
								const oldImg =
									comment.image.split("/image/")[1];
								console.log("old image file: ", oldImg);
								fs.unlink(
									`app/public/files/comment/${oldImg}`,
									() => {}
								);
							}
							const filePath = `/image/${fileName}`;
							//const filePath = `${req.protocol}://${req.get(
							//	"host"
							//)}/image/${fileName}`;
							await pipeline(
								req.file.stream,
								fs.createWriteStream(
									path.join(
										__dirname,
										"/public",
										"/files",
										"/comment",
										"/",
										fileName
									)
								)
							);
							if (req.auth.role === "admin") {
								comment
									.update({
										message: req.body.message,
										image: filePath,
										editedAt: new Date(),
										editedByAdmin: 1,
									})
									.then(() => {
										console.log(
											"success, post updated by admin: ",
											comment
										);
										res.status(200).json({
											message: "comment updated by admin",
										});
									})
									.catch((err) =>
										res.status(400).json({ err })
									);
							} else {
								comment
									.update({
										message: req.body.message,
										image: filePath,
										editedAt: new Date(),
										editedByAdmin: 0,
									})
									.then(() => {
										console.log(
											"success, post updated: ",
											comment
										);
										res.status(200).json({
											message: "comment updated",
										});
									})
									.catch((err) =>
										res.status(400).json({ err })
									);
							}
						}
					} else {
						if (req.body.image == "") {
							const oldImg = comment.image.split("/image/")[1];
							console.log("old image: ", oldImg);
							fs.unlink(
								`app/public/files/comment/${oldImg}`,
								() => {}
							);
							if (req.auth.role === "admin") {
								comment.update({
									image: null,
									editedAt: new Date(),
									editedByAdmin: 1,
								});
							} else {
								comment.update({
									image: null,
									editedAt: new Date(),
									editedByAdmin: 0,
								});
							}
						}
						if (req.auth.role === "admin") {
							comment
								.update({
									message: req.body.message,
									editedAt: new Date(),
									editedByAdmin: 1,
								})
								.then(() => {
									console.log(
										"success, post updated by admin: ",
										comment
									);
									res.status(200).json({
										message: "comment updated by admin",
									});
								})
								.catch((err) => res.status(400).json({ err }));
						} else {
							comment
								.update({
									message: req.body.message,
									editedAt: new Date(),
									editedByAdmin: 0,
								})
								.then(() => {
									console.log(
										"success, post updated: ",
										comment
									);
									res.status(200).json({
										message: "comment updated",
									});
								})
								.catch((err) => res.status(400).json({ err }));
						}
					}
				})
				.catch((err) => res.status(400).json({ err }));
		});
	} catch (err) {
		console.log("error: comment not updated", err, res.statusCode);
		res.status(500).json({ err });
	}
};

const deleteComment = (req, res) => {
	Post.findByPk(req.params.id).then((post) => {
		if (!post) {
			return res.status(404).json({ message: "comment not found" });
		}
		Comment.findOne({ where: { id: req.params.cid, post_id: post.id } })
			.then((comment) => {
				if (!comment) {
					return res
						.status(404)
						.json({ message: "comment not found" });
				}
				if (
					req.auth.role != "admin" &&
					comment.user_id != req.auth.user_id
				) {
					return res.status(401).json({ message: "Unauthorized" });
				}
				comment
					.destroy()
					.then(async () => {
						await post.update({
							discussions: db.literal("discussions - 1"),
						});
						res.status(200).json({ message: "Comment deleted !" });
					})
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((err) => {
				res.status(500).json({ err });
			});
	});
};

export {
	createComment,
	getAllPostComments,
	findOnePostComment,
	updateComment,
	deleteComment,
};

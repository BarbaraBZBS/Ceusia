import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
const pipeline = promisify(stream.pipeline);
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

// Create and Save a new Post
const createPost = async (req, res, next) => {
	console.log(req.body);
	console.log(req.file);
	const date = JSON.stringify(Date.now());
	const newD = date.split(date[6]).pop();
	try {
		let filePath = "";
		if (req.file) {
			const nameToFormat = req.file.originalName.split(" ");
			const splittedName = nameToFormat.join("_");
			const fileOriginName = splittedName.split(".")[0];

			if (req.file.detectedMimeType == null) {
				return res.status(403).json({ message: "Bad file type" });
			} else if (
				!req.file.detectedMimeType.startsWith("image") &&
				!req.file.detectedMimeType.startsWith("video") &&
				!req.file.detectedMimeType.startsWith("audio")
			) {
				return res.status(403).json({ message: "Bad file type" });
			} else if (req.file.size > 8000000) {
				return res.status(409).json({ message: "Max size reached" });
			} else {
				const fileName =
					`${fileOriginName}` +
					`${req.auth.user_id}` +
					`${newD}` +
					req.file.detectedFileExtension;
				console.log("filen: ", fileName);
				if (req.file.detectedMimeType.startsWith("image")) {
					filePath = `${req.protocol}://${req.get(
						"host"
					)}/image/${fileName}`;
					console.log("image: ", filePath);
				} else if (req.file.detectedMimeType.startsWith("video")) {
					filePath = `${req.protocol}://${req.get(
						"host"
					)}/video/${fileName}`;
					console.log("video: ", filePath);
				} else if (req.file.detectedMimeType.startsWith("audio")) {
					filePath = `${req.protocol}://${req.get(
						"host"
					)}/audio/${fileName}`;
					console.log("audio: ", filePath);
				}

				await pipeline(
					req.file.stream,
					fs.createWriteStream(
						path.join(
							__dirname,
							"/public",
							"/files",
							"/post",
							"/",
							fileName
						)
					)
				);

				await Post.create({
					title: req.body.title,
					content: req.body.content,
					fileUrl: filePath,
					link: req.body.link,
					user_id: req.auth.user_id,
				});
			}
		} else {
			console.log("user: ", req.auth.user_id);
			await Post.create({
				title: req.body.title,
				content: req.body.content,
				link: req.body.link,
				user_id: req.auth.user_id,
			});
		}
		console.log("success: post created");
		res.status(201).json({ message: "post created" });
	} catch (err) {
		console.log(err);
		console.log("error: post not created", res.statusCode);
		res.status(500).json({ message: "post creation error" });
	}
};

// Retrieve all Posts from the database.
const getAllPosts = async (req, res) => {
	await Post.findAll({
		order: [["createdAt", "DESC"]],
		include: {
			model: User,
			attributes: ["username", "email", "picture"],
		},
	})
		.then((posts) => {
			if (posts) {
				//console.log( posts )
				res.status(200).json(posts);
			} else {
				res.status(404).json({ message: "No posts found" });
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

const getPosts = async (req, res) => {
	const pageAsNumber = Number.parseInt(req.query.page);
	const perPageAsNumber = Number.parseInt(req.query.per_page);
	let page = 1;
	if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
		page = pageAsNumber;
	}
	let per_page = 6;
	if (
		!Number.isNaN(perPageAsNumber) &&
		perPageAsNumber > 0 &&
		perPageAsNumber < 6
	) {
		per_page = perPageAsNumber;
	}
	//console.log("page: ", page, "per_page: ", per_page);
	await Post.findAndCountAll({
		order: [["createdAt", "DESC"]],
		limit: per_page,
		offset: (page - 1) * per_page,
		include: [
			{
				model: User,
				attributes: ["username", "email", "picture"],
			},
		],
	})
		.then((posts) => {
			if (posts) {
				console.log("sliced posts : ", posts);
				res.status(200).json({
					content: posts.rows,
					totalPages: Math.ceil(posts.count / per_page),
				});
			} else {
				res.status(404).json({ message: "No posts found" });
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

// Find a single Post with an id
const findOnePost = (req, res) => {
	Post.findByPk(req.params.id, {
		include: {
			model: User,
			attributes: ["id", "username", "email", "picture"],
		},
	})
		.then((post) => {
			if (post) {
				res.status(200).json(post);
			} else {
				res.status(404).send();
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

const findUserPosts = async (req, res) => {
	await Post.findAll({
		where: {
			user_id: req.params.uid,
		},
		order: [["createdAt", "DESC"]],
	})
		.then((posts) => {
			if (posts) {
				res.status(200).json(posts);
			} else {
				res.status(404).json({ message: "No posts found" });
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

// Update a Post identified by id in the request
const updatePost = (req, res, next) => {
	const date = JSON.stringify(Date.now());
	const newD = date.split(date[6]).pop();

	try {
		let filePath = "";
		Post.findByPk(req.params.id)
			.then(async (post) => {
				if (!post) {
					return res.status(404).json({ message: "post not found" });
				}
				if (
					req.auth.role != "admin" &&
					post.user_id != req.auth.user_id
				) {
					return res.status(401).json({ message: "Unauthorized" });
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
						!req.file.detectedMimeType.startsWith("image") &&
						!req.file.detectedMimeType.startsWith("video") &&
						!req.file.detectedMimeType.startsWith("audio")
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
						if (post.fileUrl) {
							const oldFile =
								post.fileUrl.split("/image/")[1] ||
								post.fileUrl.split("/video/")[1] ||
								post.fileUrl.split("/audio/")[1];
							console.log("old image file: ", oldFile);
							fs.unlinkSync(`app/public/files/post/${oldFile}`);
						}
						if (req.file.detectedMimeType.startsWith("image")) {
							filePath = `${req.protocol}://${req.get(
								"host"
							)}/image/${fileName}`;
						} else if (
							req.file.detectedMimeType.startsWith("video")
						) {
							filePath = `${req.protocol}://${req.get(
								"host"
							)}/video/${fileName}`;
						} else if (
							req.file.detectedMimeType.startsWith("audio")
						) {
							filePath = `${req.protocol}://${req.get(
								"host"
							)}/audio/${fileName}`;
						}
						await pipeline(
							req.file.stream,
							fs.createWriteStream(
								path.join(
									__dirname,
									"/public",
									"/files",
									"/post",
									"/",
									fileName
								)
							)
						);
						if (req.auth.role === "admin") {
							post.update({
								title: req.body.title,
								content: req.body.content,
								fileUrl: filePath,
								link: req.body.link,
								editedAt: new Date(),
								editedByAdmin: 1,
							})
								.then(() => {
									console.log(
										"success, post updated: ",
										post
									);
									res.status(200).json({
										message: "post updated",
									});
								})
								.catch((err) => res.status(500).json({ err }));
						} else {
							post.update({
								title: req.body.title,
								content: req.body.content,
								fileUrl: filePath,
								link: req.body.link,
								editedAt: new Date(),
								editedByAdmin: 0,
							})
								.then(() => {
									console.log(
										"success, post updated: ",
										post
									);
									res.status(200).json({
										message: "post updated",
									});
								})
								.catch((err) => res.status(500).json({ err }));
						}
					}
				} else {
					if (req.body.fileUrl == "") {
						const oldFile =
							post.fileUrl.split("/image/")[1] ||
							post.fileUrl.split("/video/")[1] ||
							post.fileUrl.split("/audio/")[1];
						console.log("old image file: ", oldFile);
						fs.unlinkSync(`app/public/files/post/${oldFile}`);
						if (req.auth.role === "admin") {
							post.update({
								fileUrl: null,
								editedAt: new Date(),
								editedByAdmin: 1,
							});
						} else {
							post.update({
								fileUrl: null,
								editedAt: new Date(),
								editedByAdmin: 0,
							});
						}
					}
					if (req.auth.role === "admin") {
						post.update({
							title: req.body.title,
							content: req.body.content,
							link: req.body.link,
							editedAt: new Date(),
							editedByAdmin: 1,
						});
						console.log("success, post updated by admin: ", post);
						res.status(200).json({
							message: "post updated by admin",
						});
					} else {
						post.update({
							title: req.body.title,
							content: req.body.content,
							link: req.body.link,
							editedAt: new Date(),
							editedByAdmin: 0,
						});
						console.log("success, post updated: ", post);
						res.status(200).json({ message: "post updated" });
					}
				}
			})
			.catch((err) => res.status(400).json({ err }));
	} catch (err) {
		console.log(err);
		console.log("error: post not updated", res.statusCode);
		res.status(400).json({ err });
	}
};

// Delete a Post with the specified id in the request
const deletePost = (req, res) => {
	Post.findByPk(req.params.id)
		.then((post) => {
			if (!post) {
				return res.status(404).json({ message: "post not found" });
			}
			if (req.auth.role != "admin" && post.user_id != req.auth.user_id) {
				return res.status(401).json({ message: "Unauthorized" });
			}
			if (post.fileUrl) {
				const filename =
					post.fileUrl.split("/image/")[1] ||
					post.fileUrl.split("/video/")[1] ||
					post.fileUrl.split("/audio/")[1];
				console.log("filename: ", filename);
				fs.unlink(`app/public/files/post/${filename}`, () => {
					post.destroy()
						.then(() => {
							res.status(200).json({ message: "Post deleted !" });
						})
						.catch((error) => res.status(400).json({ error }));
				});
			} else {
				post.destroy()
					.then(() => {
						res.status(200).json({ message: "Post deleted !" });
					})
					.catch((error) => res.status(400).json({ error }));
			}
		})
		.catch((err) => {
			res.status(500).json({ err });
		});
};

export {
	createPost,
	getAllPosts,
	getPosts,
	findOnePost,
	findUserPosts,
	updatePost,
	deletePost,
};

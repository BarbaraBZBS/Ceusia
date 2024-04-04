import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//handling multer v2
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
const pipeline = promisify(stream.pipeline);
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

/**
 * Create a post
 * @date 3/31/2024 - 8:37:58 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createPost = async (req, res, next) => {
	//console.log(req.body);
	//console.log(req.file);
	const date = JSON.stringify(Date.now());
	const newD = date.split(date[6]).pop();

	try {
		let filePath = "";
		if (req.file) {
			const nameToFormat = req.file.originalName.split(" ");
			const splitName = nameToFormat.join("_");
			const fileOriginName = splitName.split(".")[0];

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
				//console.log("filen: ", fileName);
				if (req.file.detectedMimeType.startsWith("image")) {
					filePath = `/image/${fileName}`;
					//console.log("image: ", filePath);
				} else if (req.file.detectedMimeType.startsWith("video")) {
					filePath = `/video/${fileName}`;
					//console.log("video: ", filePath);
				} else if (req.file.detectedMimeType.startsWith("audio")) {
					filePath = `/audio/${fileName}`;
					//console.log("audio: ", filePath);
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
			//console.log("user: ", req.auth.user_id);
			await Post.create({
				title: req.body.title,
				content: req.body.content,
				link: req.body.link,
				user_id: req.auth.user_id,
			});
		}
		//console.log("success: post created");
		return res.status(201).json({ message: "post created" });
	} catch (err) {
		console.log(err);
		console.log("error: post not created", res.statusCode);
		res.status(500).json({ message: "post creation error" });
	}
};

/**
 * Read all posts
 * @date 3/31/2024 - 8:37:57 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const getAllPosts = async (req, res) => {
	await Post.findAll({
		order: [["createdAt", "DESC"]],
		include: {
			model: User,
			attributes: ["username", "email", "picture"],
		},
	})
		.then((posts) => {
			if (!posts) {
				return res.status(404).json({ message: "No posts found" });
			} else {
				//console.log( posts )
				return res.status(200).json(posts);
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

/**
 * Read a limited number of posts for frontend pagination
 * @date 3/31/2024 - 8:37:57 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
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
			if (!posts) {
				return res.status(404).json({ message: "No posts found" });
			} else {
				//console.log("sliced posts : ", posts);
				return res.status(200).json({
					content: posts.rows,
					totalPages: Math.ceil(posts.count / per_page),
				});
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

/**
 * Read one post
 * @date 3/31/2024 - 8:37:57 PM
 *
 * @param {*} req
 * @param {*} res
 */
const findOnePost = (req, res) => {
	Post.findByPk(req.params.id, {
		include: {
			model: User,
			attributes: ["id", "username", "email", "picture"],
		},
	})
		.then((post) => {
			if (!post) {
				return res.status(404).send();
			} else {
				return res.status(200).json(post);
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

/**
 * Read all posts of a user
 * @date 3/31/2024 - 8:37:57 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const findUserPosts = async (req, res) => {
	await Post.findAll({
		where: {
			user_id: req.params.uid,
		},
		order: [["createdAt", "DESC"]],
	})
		.then((posts) => {
			if (!posts) {
				return res.status(404).json({ message: "No posts found" });
			} else {
				return res.status(200).json(posts);
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

/**
 * Update a post
 * @date 3/31/2024 - 8:37:57 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
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
					const splitName = nameToFormat.join("_");
					const fileOriginName = splitName.split(".")[0];

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
							//console.log("old image file: ", oldFile);
							//fs.unlinkSync(`app/public/files/post/${oldFile}`);
							fs.unlink(
								`app/public/files/post/${oldFile}`,
								() => {}
							);
						}
						if (req.file.detectedMimeType.startsWith("image")) {
							filePath = `/image/${fileName}`;
						} else if (
							req.file.detectedMimeType.startsWith("video")
						) {
							filePath = `/video/${fileName}`;
						} else if (
							req.file.detectedMimeType.startsWith("audio")
						) {
							filePath = `/audio/${fileName}`;
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
									return res.status(200).json({
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
									return res.status(200).json({
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
						//console.log("old image file: ", oldFile);
						fs.unlink(`app/public/files/post/${oldFile}`, () => {});
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
						//console.log("success, post updated by admin: ", post);
						return res.status(200).json({
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
						//console.log("success, post updated: ", post);
						return res
							.status(200)
							.json({ message: "post updated" });
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

/**
 * Delete a post
 * @date 3/31/2024 - 8:37:57 PM
 *
 * @param {*} req
 * @param {*} res
 */
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
				//console.log("filename: ", filename);
				fs.unlink(`app/public/files/post/${filename}`, () => {
					post.destroy()
						.then(() => {
							return res
								.status(200)
								.json({ message: "Post deleted" });
						})
						.catch((error) => res.status(400).json({ error }));
				});
			} else {
				post.destroy()
					.then(() => {
						return res
							.status(200)
							.json({ message: "Post deleted" });
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

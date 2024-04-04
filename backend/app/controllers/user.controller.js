import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user details regex literal notations
const USER_REGEX = /(^[a-zA-Z-_]{3,3})+([A-Za-z0-9]){1,12}$/;
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,35})$/;

/**
 * Create a user
 * @date 3/31/2024 - 9:17:50 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const signup = async (req, res, next) => {
	if (req.body.email == null || req.body.password == null) {
		return res.status(400).json({ message: "empty field(s)" });
	}
	if (!USER_REGEX.test(req.body.username)) {
		return res.status(400).json({
			message:
				"username must be 4 to 15 characters, starting with letters.",
		});
	}
	if (!EMAIL_REGEX.test(req.body.email)) {
		return res.status(400).json({ message: "invalid email" });
	}
	if (!PASSWORD_REGEX.test(req.body.password)) {
		return res.status(400).json({
			message:
				"password must be 6 to 35 characters and contain at least 1 number and 1 letter.",
		});
	}

	const usernameExists = await User.findOne({
		where: { username: req.body.username },
	});
	if (usernameExists) {
		return res.status(409).json({ message: "username already taken" });
	}

	const emailExists = await User.findOne({
		where: { email: req.body.email },
	});
	if (emailExists) {
		return res.status(403).json({ message: "email already taken" });
	}

	bcrypt
		.hash(req.body.password, 15)
		.then((hash) => {
			User.create({
				username: req.body.username,
				email: req.body.email,
				password: hash,
			})
				.then((user) => {
					if (req.body.role) {
						user.update({
							role: req.body.role,
						});
					}
					return res.status(200).json(user);
				})
				.catch((error) => {
					res.status(400).send({ message: error.message });
				});
		})
		.catch((error) => res.status(500).json({ error }));
};

/**
 * Allow user to enter application
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const login = async (req, res, next) => {
	const maxAge = 3 * 24 * 60 * 60 * 1000;
	try {
		const user = await User.findOne({ where: { email: req.body.email } });
		console.log(req.body.email);
		console.log(user);
		if (!user) {
			return res.status(401).json({ message: "Incorrect login details" });
		}
		await bcrypt
			.compare(req.body.password, user.password)
			.then((valid) => {
				if (!valid) {
					return res
						.status(401)
						.json({ message: "Incorrect login details" });
				}
				const token = jwt.sign(
					{
						user_id: user.id,
						role: user.role,
					},
					process.env.SECRET_TOKEN,
					{ expiresIn: "10m" }
				);
				const refreshToken = jwt.sign(
					{
						user_id: user.id,
						role: user.role,
					},
					process.env.REFRESH_SECRET_TOKEN,
					{ expiresIn: maxAge }
				);
				//cookie secure is changed for production
				return res
					.cookie("jwt", token, {
						httpOnly: true,
						secure: false,
						sameSite: "None",
					})
					.status(200)
					.json({
						user_id: user.id,
						username: user.username,
						role: user.role,
						token,
						refreshToken,
					});
			})
			.catch((error) => {
				// console.log( 'cookies error', res.cookie )
				console.log("error", error);
				res.status(500).json({ error });
			});
	} catch (error) {
		console.log("error finder: ", error.message);
		res.status(500).json({ error });
	}
};

/**
 * Leave application
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const logout = async (req, res, next) => {
	const cookie = req.cookies;
	if (!cookie.jwt) return res.sendStatus(204);
	const token = cookie.jwt;
	const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
	const user_id = decodedToken.user_id;
	const user = await User.findOne({ where: { id: user_id } });
	if (!user) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});
		return res.sendStatus(204);
	}
	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	}).sendStatus(204);
};

/**
 * Give user a new token
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const refreshUserToken = async (req, res, next) => {
	try {
		const refresh = req.body.refreshToken;
		const decodedRefToken = jwt.verify(
			refresh,
			process.env.REFRESH_SECRET_TOKEN
		);
		const user_id = decodedRefToken.user_id;
		const user = await User.findOne({ where: { id: user_id } });
		if (user_id === user.id) {
			const token = jwt.sign(
				{
					user_id: user.id,
					role: user.role,
				},
				process.env.SECRET_TOKEN,
				{ expiresIn: "10m" }
			);
			res.cookie("jwt", token, {
				httpOnly: true,
				secure: false,
				sameSite: "None",
			})
				.status(200)
				.json({ token });
		} else {
			return res.sendStatus(401);
		}
	} catch (err) {
		console.log("error refreshing", err);
		res.status(500).json({ message: "Could not refresh token" });
	}
};

/**
 * Read all users' details
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllUsers = (req, res, next) => {
	User.findAll({
		attributes: { exclude: ["password", "role"] },
	})
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "No users found" });
			} else {
				return res.status(200).json(users);
			}
		})
		.catch((error) => res.status(400).json({ error }));
};

/**
 * Read a single user details
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const findOneUser = async (req, res, next) => {
	await User.findByPk(req.params.id, {
		attributes: { exclude: ["password", "role"] },
	})
		.then((user) => {
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			} else {
				return res.status(200).json(user);
			}
		})
		.catch((error) => res.status(400).json({ error }));
};

/**
 * Update a user' detail(s)
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 */
const updateUser = async (req, res) => {
	await User.findByPk(req.params.id)
		.then(async (user) => {
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			} else {
				// console.log( user )
				if (req.auth.role != "admin" && user.id != req.auth.user_id) {
					return res.status(401).json({ message: "Unauthorized" });
				}
				if (req.body.password) {
					if (!PASSWORD_REGEX.test(req.body.password)) {
						return res.status(409).json({
							message:
								"password must be 6 to 35 characters and contain at least 1 number and 1 letter.",
						});
					}
					await bcrypt
						.compare(req.body.currpsw, user.password)
						.then((valid) => {
							if (!valid) {
								return res
									.status(401)
									.json({ message: "Incorrect details" });
							}
							bcrypt
								.hash(req.body.password, 15)
								.then((hash) => {
									user.update({ password: hash })
										.then(() => {
											res.status(200).json({
												message:
													"success: user password modified.",
											});
										})
										.catch((err) =>
											res
												.status(500)
												.send({ message: err.message })
										);
								})
								.catch((err) => res.status(400).json({ err }));
						})
						.catch((err) => res.status(400).json({ err }));
				} else if (req.body.username) {
					if (
						req.body.username.length <= 4 ||
						req.body.username.length >= 16
					) {
						return res.status(409).json({
							message: "username must be 4 to 15 characters.",
						});
					} else {
						user.update({ username: req.body.username })
							.then(() => {
								//console.log(req.body.username);
								res.status(200).json({
									message: "Success: username modified.",
								});
							})
							.catch((err) => {
								console.log("error: ", err);
								res.status(400).json({ message: err });
							});
					}
				} else if (req.body.email) {
					if (!EMAIL_REGEX.test(req.body.email)) {
						return res
							.status(409)
							.json({ message: "invalid email" });
					} else {
						user.update({ email: req.body.email })
							.then(() => {
								//console.log(req.body.email);
								res.status(200).json({
									message: "Success: user email modified.",
								});
							})
							.catch((err) => {
								console.log("error: ", err);
								res.status(400).json({ message: err });
							});
					}
				} else if (req.body.motto) {
					if (req.body.motto === " ") {
						user.update({ motto: null })
							.then(() => {
								//console.log(req.body.motto);
								res.status(200).json({
									message: "Success: user motto modified.",
								});
							})
							.catch((err) => {
								console.log("error: ", err);
								res.status(400).json({ message: err });
							});
					} else {
						user.update({ motto: req.body.motto })
							.then(() => {
								//console.log(req.body.motto);
								res.status(200).json({
									message: "Success: user motto modified.",
								});
							})
							.catch((err) => {
								console.log("error: ", err);
								res.status(400).json({ message: err });
							});
					}
				}
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

/**
 * Delete a post
 * @date 3/31/2024 - 9:17:49 PM
 *
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteUser = async (req, res, next) => {
	await User.findByPk(req.params.id)
		.then((user) => {
			if (!user) {
				res.status(404).json({ message: "User not found" });
			} else {
				if (req.auth.role != "admin" && user.id != req.auth.user_id) {
					return res.status(401).json({ message: "Unauthorized" });
				}
				user.destroy()
					.then(() =>
						res
							.status(200)
							.json({ message: "Success: user deleted !" })
					)
					.catch((error) => res.status(400).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

export {
	signup,
	login,
	logout,
	refreshUserToken,
	getAllUsers,
	findOneUser,
	updateUser,
	deleteUser,
};

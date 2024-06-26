import jwt from "jsonwebtoken";

/**
 * authentication method
 * @date 3/31/2024 - 11:41:58 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const auth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
		const user_id = decodedToken.user_id;
		const role = decodedToken.role;
		req.auth = {
			user_id: user_id,
			role: role,
		};
		next();
	} catch (error) {
		res.status(401).json({ error });
	}
};

export default auth;

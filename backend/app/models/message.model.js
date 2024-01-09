import { db } from "./db.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";

const Message = db.define("message", {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "user",
			key: "id",
		},
	},
	sender_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "user",
			key: "id",
		},
	},
	body: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	logged_user: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

export default Message;

User.belongsToMany(User, {
	//'as' is needed for many-to-many self-associations
	as: "receiver",
	through: Message,
	foreignKey: "user_id",
});
User.belongsToMany(User, {
	//'as' is needed for many-to-many self-associations
	as: "sender",
	through: Message,
	foreignKey: "sender_id",
});

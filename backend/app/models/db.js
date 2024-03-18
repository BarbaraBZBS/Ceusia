// const dbConfig = require( "../config/db.config.js" );
import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
//const database = require()

const db = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

const connectToDb = async () => {
	try {
		await db.authenticate();
		console.log("Successfully connected to db");
	} catch (error) {
		console.log(error);
	}
};

export { db, connectToDb };

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.posts = require( "./post.model.js" )( sequelize, Sequelize );

// module.exports = db;

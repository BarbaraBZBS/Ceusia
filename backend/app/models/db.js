const dbConfig = require( "../config/db.config.js" );
const { Sequelize } = require( 'sequelize' );
//const database = require()

const sequelize = new Sequelize( dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
} );

const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        console.log( "Successfully connected to db" );
    }
    catch ( error ) {
        console.log( error );
    }
};

module.exports = { sequelize, connectToDb }

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.posts = require( "./post.model.js" )( sequelize, Sequelize );

// module.exports = db;
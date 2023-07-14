const { sequelize } = require( './db.js' );
const { DataTypes } = require( 'sequelize' );
// const post = require( '../models/post' );


const User = sequelize.define( "user", {
    username: {
        type: DataTypes.STRING, allowNull: false, unique: true,
    },
    email: {
        type: DataTypes.STRING, allowNull: false, unique: true,
        validate: {
            isEmail: true, notNull: true, notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING, allowNull: false
    },
    // role: {
    //     type: DataTypes.STRING, default: "user"
    // }
}, {
    timestamps: false,
} );

// User.sync()

module.exports = User;
const { sequelize } = require( './db.js' );
const { DataTypes } = require( 'sequelize' );
const user = require( '../models/user.model.js' );


const Post = sequelize.define( "post", {
    title: {
        type: DataTypes.STRING, allowNull: true
    },
    content: {
        type: DataTypes.TEXT, allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    videoUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    musicUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER, defaultValue: 0
    },
    dislikes: {
        type: DataTypes.INTEGER, defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER, allowNull: false
    }
} );

module.exports = Post;

user.hasMany( Post, {
    foreignKey: 'user_id'
} );
Post.belongsTo( user, {
    foreignKey: 'user_id'
} );
import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from '../models/user.model.js';

const Post = db.define( "post", {
    title: {
        type: DataTypes.STRING, allowNull: true
    },
    content: {
        type: DataTypes.TEXT, allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    link: {
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
    },
    discussions: {
        type: DataTypes.INTEGER, defaultValue: 0
    },
    editedAt: {
        type: DataTypes.TIME
    }
} );

export default Post;

User.hasMany( Post, {
    foreignKey: 'user_id'
} );
Post.belongsTo( User, {
    foreignKey: 'user_id'
} );
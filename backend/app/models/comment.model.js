import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

const Comment = db.define( 'comment', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'post',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT, allowNull: false,
    },
    image: {
        type: DataTypes.STRING, allowNull: true,
    },
    likes: {
        type: DataTypes.INTEGER, defaultValue: 0
    },
    dislikes: {
        type: DataTypes.INTEGER, defaultValue: 0
    },
    editedAt: {
        type: DataTypes.TIME
    }
}, {
    freezeTableName: true,
    tableName: 'comment'
} );

export default Comment;

User.hasMany( Comment, {
    foreignKey: 'user_id'
} );
Comment.belongsTo( User, {
    foreignKey: 'user_id'
} );
Post.hasMany( Comment, {
    foreignKey: 'post_id'
} );
Comment.belongsTo( Post, {
    foreignKey: 'post_id'
} );
User.belongsToMany( Post, {
    through: Comment,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
Post.belongsToMany( User, {
    through: Comment,
    foreignKey: 'post_id',
    otherKey: 'user_id'
} );
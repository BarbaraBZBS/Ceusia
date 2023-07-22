import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';


const Like = db.define( 'like', {
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
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'like'
} );

export default Like;

User.belongsToMany( Post, {
    through: Like,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
Post.belongsToMany( User, {
    through: Like,
    foreignKey: 'post_id',
    otherKey: 'user_id'
} );
// Like.hasMany( user, {
//     foreignKey: 'user_id',
//     as: 'user'
// } );
// Like.hasOne( post, {
//     foreignKey: 'post_id',
//     as: 'post'
// } );
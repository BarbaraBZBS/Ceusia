import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';


const Dislike = db.define( 'dislike', {
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
    tableName: 'dislike'
} );

export default Dislike;

User.belongsToMany( Post, {
    through: Dislike,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
Post.belongsToMany( User, {
    through: Dislike,
    foreignKey: 'post_id',
    otherKey: 'user_id'
} );
// Dislike.hasMany( user, {
//     foreignKey: 'user_id',
//     as: 'user'
// } );
// Dislike.hasOne( post, {
//     foreignKey: 'post_id',
//     as: 'post'
// } );

import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from './user.model.js';
import Post from './post.model.js';

const Likepost = db.define( 'likepost', {
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
    tableName: 'likepost'
} );

export default Likepost;

User.belongsToMany( Post, {
    through: Likepost,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
Post.belongsToMany( User, {
    through: Likepost,
    foreignKey: 'post_id',
    otherKey: 'user_id'
} );

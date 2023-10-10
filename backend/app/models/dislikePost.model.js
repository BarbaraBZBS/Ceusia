import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from './user.model.js';
import Post from './post.model.js';

const Dislikepost = db.define( 'dislikepost', {
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
    tableName: 'dislikepost'
} );

export default Dislikepost;

User.belongsToMany( Post, {
    through: Dislikepost,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
Post.belongsToMany( User, {
    through: Dislikepost,
    foreignKey: 'post_id',
    otherKey: 'user_id'
} );

import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from './user.model.js';
import Comment from './comment.model.js';

const Likecomment = db.define( 'likecomment', {
    comment_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'comment',
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
    tableName: 'likecomment'
} );

export default Likecomment;

User.belongsToMany( Comment, {
    through: Likecomment,
    foreignKey: 'user_id',
    otherKey: 'comment_id'
} );
Comment.belongsToMany( User, {
    through: Likecomment,
    foreignKey: 'comment_id',
    otherKey: 'user_id'
} );

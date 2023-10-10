import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from './user.model.js';
import Comment from './comment.model.js';

const Dislikecomment = db.define( 'dislikecomment', {
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
    tableName: 'dislikecomment'
} );

export default Dislikecomment;

User.belongsToMany( Comment, {
    through: Dislikecomment,
    foreignKey: 'user_id',
    otherKey: 'comment_id'
} );
Comment.belongsToMany( User, {
    through: Dislikecomment,
    foreignKey: 'comment_id',
    otherKey: 'user_id'
} );
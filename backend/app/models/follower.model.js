import { db } from './db.js';
import { DataTypes } from 'sequelize';
import User from './user.model.js';

const User_Follower = db.define( 'user_Follower', {
    user_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    follower_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    }
}, {
    timestamps: false,
} );

export default User_Follower;

User.belongsToMany( User, {
    //'as' is needed for many-to-many self-associations
    as: 'user',
    through: User_Follower,
    foreignKey: 'user_id'
} );
User.belongsToMany( User, {
    //'as' is needed for many-to-many self-associations
    as: 'follower',
    through: User_Follower,
    foreignKey: 'follower_id'
} );

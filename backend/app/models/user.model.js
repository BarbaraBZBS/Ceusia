import { db } from './db.js';
import { DataTypes } from 'sequelize';

const User = db.define( "user", {
    username: {
        type: DataTypes.STRING(), allowNull: false, unique: true,
        validate: {
            max: {
                args: [ 15 ],
                msg: "Maximum 15 characters allowed in username"
            },
            min: {
                args: [ 4 ],
                msg: "Minimum 4 characters required in username"
            }
        }
    },
    email: {
        type: DataTypes.STRING, allowNull: false, unique: true,
        validate: {
            isEmail: true, notNull: true, notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING, allowNull: false,
        validate: {
            max: {
                args: [ 35 ],
                msg: "Maximum 35 characters allowed in password"
            },
            min: {
                args: [ 6 ],
                msg: "Minimum 6 characters required in password"
            }
        }
    },
    picture: {
        type: DataTypes.STRING, default: "http://localhost:8000/profile/defaultUser.png"
    },
    motto: {
        type: DataTypes.TEXT, allowNull: true,
    },
    role: {
        type: DataTypes.STRING, default: "user"
    }
}, {
    timestamps: false,
} );

export default User;
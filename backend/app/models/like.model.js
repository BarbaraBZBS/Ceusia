const { sequelize } = require( './db.js' );
const { DataTypes } = require( 'sequelize' );
const user = require( '../models/user.model.js' );
const post = require( '../models/post.model.js' );


const Like = sequelize.define( 'like', {
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

module.exports = Like;

user.belongsToMany( post, {
    through: Like,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
post.belongsToMany( user, {
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
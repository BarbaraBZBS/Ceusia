const { sequelize } = require( './db.js' );
const { DataTypes } = require( 'sequelize' );
const user = require( '../models/user.model.js' );
const post = require( '../models/post.model.js' );


const Dislike = sequelize.define( 'dislike', {
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

module.exports = Dislike;

user.belongsToMany( post, {
    through: Dislike,
    foreignKey: 'user_id',
    otherKey: 'post_id'
} );
post.belongsToMany( user, {
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

const { sequelize } = require( './db.js' );
const { DataTypes } = require( 'sequelize' );
const user = require( '../models/user.model.js' );


const Post = sequelize.define( "post", {
    title: {
        type: DataTypes.TEXT, allowNull: true
    },
    content: {
        type: DataTypes.TEXT, allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    videoUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    musicUrl: {
        type: DataTypes.STRING, allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER, defaultValue: 0
    }
} );
// Post.associate = function ( models ) {
//     //define associations
// }

//Post.sync()
//sequelize.sync()
// })
// constructor
// class Post {
//     constructor( post ) {
//         this.title = post.title;
//         this.content = post.content;
//         this.imageUrl = post.imageUrl;
//         this.videoUrl = post.videoUrl;
//         this.musicUrl = post.musicUrl;
//         //to be updated
//         this.user_id = 1;
//     }
//     static create( newPost, result ) {
//         sql.query( "INSERT INTO post SET ?", newPost, ( err, res ) => {
//             if ( err ) {
//                 console.log( "error: ", err );
//                 result( err, null );
//                 return;
//             }

//             console.log( "created post: ", { id: res.insertId, ...newPost } );
//             result( null, { id: res.insertId, ...newPost } );
//         } );
//     }
//     static findById( id, result ) {
//         sql.query( `SELECT * FROM post WHERE id = ${ id }`, ( err, res ) => {
//             if ( err ) {
//                 console.log( "error: ", err );
//                 result( err, null );
//                 return;
//             }

//             if ( res.length ) {
//                 console.log( "found post: ", res[ 0 ] );
//                 result( null, res[ 0 ] );
//                 return;
//             }

//             // not found Post with the id
//             result( { kind: "not_found" }, null );
//         } );
//     }
//     static getAll( result ) {
//         let query = "SELECT * FROM post";
//         sql.query( query, ( err, res ) => {
//             if ( err ) {
//                 console.log( "error: ", err );
//                 result( null, err );
//                 return;
//             }

//             console.log( "posts: ", res );
//             result( null, res );
//         } );
//     }
//     static updateById( id, post, result ) {
//         sql.query(
//             "UPDATE post SET title = ?, content = ?, imageUrl = ?, videoUrl = ?, musicUrl = ?, likes = ?, user_id = ? WHERE id = ?",
//             [ post.title, post.content, post.imageUrl, post.videoUrl, post.musicUrl, post.likes, post.user_id, id ],
//             ( err, res ) => {
//                 if ( err ) {
//                     console.log( "error: ", err );
//                     result( null, err );
//                     return;
//                 }
//                 if ( res.affectedRows == 0 ) {
//                     // not found Post with the id
//                     result( { kind: "not_found" }, null );
//                     return;
//                 }

//                 console.log( "updated post: ", { id: id, ...post } );
//                 result( null, { id: id, ...post } );
//             }
//         );
//     }
//     static remove( id, result ) {
//         sql.query( "DELETE FROM post WHERE id = ?", id, ( err, res ) => {
//             if ( err ) {
//                 console.log( "error: ", err );
//                 result( null, err );
//                 return;
//             }

//             if ( res.affectedRows == 0 ) {
//                 // not found Post with the id
//                 result( { kind: "not_found" }, null );
//                 return;
//             }

//             console.log( "deleted post with id: ", id );
//             result( null, res );
//         } );
//     }
//     static removeAll( result ) {
//         sql.query( "DELETE FROM post", ( err, res ) => {
//             if ( err ) {
//                 console.log( "error: ", err );
//                 result( null, err );
//                 return;
//             }

//             console.log( `deleted ${ res.affectedRows } posts` );
//             result( null, res );
//         } );
//     }
// }


// const Post = db.define( 'post', {
//     title: {
//         type: DataTypes.TEXT, allowNull: true
//     },
//     content: {
//         type: DataTypes.TEXT, allowNull: false
//     },
//     imageUrl: {
//         type: DataTypes.STRING, allowNull: true
//     },
//     videoUrl: {
//         type: DataTypes.STRING, allowNull: true
//     },
//     musicUrl: {
//         type: DataTypes.STRING, allowNull: true
//     },
//     likes: {
//         type: DataTypes.INTEGER, defaultValue: 0
//     }
// }, {} );
// Post.associate = function ( models ) {
//     //define associations
// };

module.exports = Post;

user.hasMany( Post, {
    foreignKey: 'user_id'
} );
Post.belongsTo( user, {
    foreignKey: 'user_id'
} );
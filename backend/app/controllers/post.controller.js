//const Post = require( "../models/post.model.js" );
const post = require( '../models/post.model' );
const user = require( '../models/user.model' );

// Create and Save a new Post
exports.createPost = async ( req, res, next ) => {
    console.log( req.body );
    console.log( req.file );
    try {
        let imagePath = '';
        if ( req.file ) {
            if ( req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/gif' ) {
                return res.status( 400 ).json( { message: "Bad image type." } )
            }
            else {
                imagePath = `${ req.protocol }://${ req.get( "host" ) }/images/${ req.file.filename }`;
                await post.create( {
                    title: req.body.title,
                    content: req.body.content,
                    imageUrl: imagePath,
                    user_id: req.body.user_id
                } )
                // else if for videourl, musicurl ...
            }
        }
        else {
            await post.create( {
                title: req.body.title,
                content: req.body.content,
                user_id: req.body.user_id
            } )
        }
        res.status( 201 ).json( { message: 'post created' } );
        console.log( 'success: post created' );
    }
    catch ( err ) {
        console.log( err )
        res.status( 400 ).json( { err } )
        console.log( 'error: post not created', res.statusCode );
    }
};

// Retrieve all Posts from the database.
exports.getAllPosts = async ( req, res ) => {
    //console.log( posts )
    await post.findAll( {
        order: [ [ 'createdAt', 'DESC' ] ],
        include: {
            model: user,
            attributes: [ 'username', 'email' ]
        }
    } )
        .then( ( posts ) => {
            if ( posts ) {
                res.status( 200 ).json( posts )
            }
            else {
                res.status( 401 ).json( { message: 'No posts found' } )
            }
        } )
        .catch( ( err ) => {
            res.status( 400 ).json( { err } )
        } );
};

// Find a single Post with an id
exports.findOnePost = ( req, res ) => {
    post.findByPk( req.params.id, {
        include: {
            model: user,
            attributes: [ 'username', 'email' ]
        }
    } )
        .then( ( post ) => {
            if ( post ) {
                res.status( 200 ).json( post )
            }
            else {
                res.status( 404 ).send();
            }
        } )
        .catch( err => res.status( 400 ).json( { err } ) )
};

// Update a Post identified by the id in the request
exports.updatePost = async ( req, res, next ) => {
    //add fs unlink image removal
    try {
        let imagePath = '';
        await post.findByPk( req.params.id )
            .then( ( post ) => {
                if ( req.file ) {
                    if ( req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/gif' ) {
                        return res.status( 400 ).json( { message: "Bad file type." } )
                    }
                    else {
                        imagePath = `${ req.protocol }://${ req.get( "host" ) }/images/${ req.file.filename }`;
                        post.update( {
                            title: req.body.title,
                            content: req.body.content,
                            imageUrl: imagePath,
                            user_id: req.body.user_id,
                            post_id: req.body.post_id //postId??
                        } )
                        console.log( 'success, post updated: ', post )
                        res.status( 200 ).json( { message: 'post updated' } )

                    }
                }
                else {
                    post.update( {
                        title: req.body.title,
                        content: req.body.content
                    } )
                    console.log( 'success, post updated: ', post )
                    res.status( 200 ).json( { message: 'post updated' } )
                }
            } )
    }
    catch ( err ) {
        console.log( err );
        res.status( 400 ).json( { err } );
        console.log( 'error: post not updated', res.statusCode )
    }
};

// Delete a Post with the specified id in the request
exports.deletePost = ( req, res ) => {
    post.findByPk( req.params.id )
        .then( ( post ) => {
            if ( post.imageUrl ) {
                const filename = post.image.split( '/images/' )[ 1 ];
                fs.unlink( `images/${ filename }`, () => {
                    post.destroy()
                        .then( () => {
                            res.status( 200 ).json( { message: 'Post deleted !' } );
                        } )
                        .catch( error => res.status( 400 ).json( { error } ) );
                } );
            }
            else {
                post.destroy()
                    .then( () => {
                        res.status( 200 ).json( { message: 'Post deleted !' } );
                    } )
                    .catch( error => res.status( 400 ).json( { error } ) );
            }
        } )
        .catch( err => { res.status( 500 ).json( { err } ) } );
};


//like Post
// exports.likeStatusPost = async ( req, res ) => {
//     const userId = req.body.userId;
//     const postId = parseInt( req.params.id );

//     if ( postId <= 0 ) {
//         return res.status( 400 ).json( { message: 'invalid parameters' } )
//     }
//     Post.findOne( { where: { id: postId } } )
//     User.findOne( { where: { id: userId } } )
//     Like.findOne( { where: { postId: postId, userId: userId } } )
//         .then( async like => {
//             if ( like ) {
//                 await Like.destroy( { where: { postId: postId, userId: userId } } )
//                     .then( () => {
//                         Post.findOne( { where: { id: postId } } )
//                             .then( ( post ) => {
//                                 post.update( { likes: sequelize.literal( 'likes - 1' ) } )
//                                 res.status( 200 ).json( { message: 'post unliked !' } )
//                             } )
//                             .catch( error => res.status( 400 ).json( error ) )
//                     } )
//                     .catch( error => {
//                         console.log( 'error : ', error )
//                         res.status( 404 ).json( { error } )
//                     } )
//             }
//             else {
//                 await Like.create( {
//                     postId: postId,
//                     userId: userId
//                 } )
//                     .then( () => {
//                         Post.findOne( { where: { id: postId } } )
//                             .then( ( post ) => {
//                                 post.update( { likes: sequelize.literal( 'likes + 1' ) } )
//                                 res.status( 201 ).json( { message: 'post liked !' } )
//                             } )
//                             .catch( error => res.status( 400 ).json( { error } ) )
//                     } )
//                     .catch( error => {
//                         res.status( 404 ).json( { error } )
//                     } )
//             }
//         } )
//     // console.log( postId )
//     // console.log( userId )
// }

// exports.postLiked = ( req, res ) => {
//     const { userId, postId } = req.body
//     Like.findOne( { where: { postId: postId, userId: userId } } )
//         .then( ( liked ) => {
//             res.status( 200 ).json( liked )
//         } )
// }


// // Delete all Posts from the database.
// exports.deleteAll = ( req, res ) => {
//     Post.removeAll( ( err, data ) => {
//         if ( err )
//             res.status( 500 ).send( {
//                 message:
//                     err.message || "Some error occurred while removing all Posts."
//             } );
//         else res.send( { message: `All Posts were deleted successfully!` } );
//     } );
// };
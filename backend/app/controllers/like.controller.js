const post = require( '../models/post.model' );
const user = require( '../models/user.model' );
const Like = require( '../models/like.model' );
const Dislike = require( '../models/dislike.model' );
const { sequelize } = require( '../models/db' );



//like post
exports.likePost = async ( req, res ) => {
    const userId = req.auth.user_id;
    const postId = parseInt( req.params.id );

    if ( postId <= 0 ) {
        return res.status( 400 ).json( { message: 'invalid parameters' } )
    }
    post.findOne( { where: { id: postId } } )
        .then( ( post ) => {
            console.log( 'post found: ', post )
        } )

    user.findOne( { where: { id: userId } } )
        .then( ( user ) => {
            console.log( 'user found: ', user.username )
        } )

    Like.findOne( { where: { post_id: postId, user_id: userId } } )
        .then( async alreadyLiked => {
            if ( alreadyLiked ) {
                await Like.destroy( { where: { post_id: postId, user_id: userId } } )
                    .then( () => {
                        post.findOne( { where: { id: postId } } )
                            .then( ( post ) => {
                                post.update( { likes: sequelize.literal( 'likes - 1' ) } )
                                res.status( 200 ).json( { message: 'post unliked !' } )
                            } )
                            .catch( error => res.status( 400 ).json( error ) )
                    } )
                    .catch( error => {
                        console.log( 'error : ', error )
                        res.status( 404 ).json( { error } )
                    } )
            }
            else {
                Dislike.findOne( { where: { post_id: postId, user_id: userId } } )
                    .then( async ( disliked ) => {
                        if ( disliked ) {
                            await Dislike.destroy( { where: { post_id: postId, user_id: userId } } )
                                .then( () => {
                                    post.findOne( { where: { id: postId } } )
                                        .then( ( post ) => {
                                            post.update( { dislikes: sequelize.literal( 'dislikes - 1' ) } )
                                            console.log( 'post dislike removed' )
                                        } )
                                        .catch( err => { res.status( 400 ).json( { err } ) } )
                                } )
                        }
                        await Like.create( {
                            post_id: postId,
                            user_id: userId
                        } )
                            .then( () => {
                                post.findOne( { where: { id: postId } } )
                                    .then( ( post ) => {
                                        post.update( { likes: sequelize.literal( 'likes + 1' ) } )
                                        res.status( 201 ).json( { message: 'post liked !' } )
                                    } )
                                    .catch( error => res.status( 400 ).json( { error } ) )
                            } )
                            .catch( error => {
                                res.status( 404 ).json( { error } )
                            } )
                    } )
            }
        } )
    console.log( postId )
    console.log( userId )
}

//dislike post
exports.dislikePost = async ( req, res ) => {
    const userId = req.auth.user_id;
    const postId = parseInt( req.params.id );

    if ( postId <= 0 ) {
        return res.status( 400 ).json( { message: 'invalid parameters' } )
    }
    post.findOne( { where: { id: postId } } )
        .then( ( post ) => {
            console.log( 'post found: ', post )
        } )

    user.findOne( { where: { id: userId } } )
        .then( ( user ) => {
            console.log( 'user found: ', user.username )
        } )

    Dislike.findOne( { where: { post_id: postId, user_id: userId } } )
        .then( async alreadyDisliked => {
            if ( alreadyDisliked ) {
                await Dislike.destroy( { where: { post_id: postId, user_id: userId } } )
                    .then( () => {
                        post.findOne( { where: { id: postId } } )
                            .then( ( post ) => {
                                post.update( { dislikes: sequelize.literal( 'dislikes - 1' ) } )
                                res.status( 200 ).json( { message: 'post dislike removed !' } )
                            } )
                            .catch( error => res.status( 400 ).json( error ) )
                    } )
                    .catch( error => {
                        console.log( 'error : ', error )
                        res.status( 404 ).json( { error } )
                    } )

            }
            else {
                Like.findOne( { where: { post_id: postId, user_id: userId } } )
                    .then( async ( liked ) => {
                        if ( liked ) {
                            await Like.destroy( { where: { post_id: postId, user_id: userId } } )
                                .then( () => {
                                    post.findOne( { where: { id: postId } } )
                                        .then( ( post ) => {
                                            post.update( { likes: sequelize.literal( 'likes - 1' ) } )
                                            console.log( 'post unliked' )
                                        } )
                                        .catch( err => { res.status( 400 ).json( { err } ) } )
                                } )
                        }
                        await Dislike.create( {
                            post_id: postId,
                            user_id: userId
                        } )
                            .then( () => {
                                post.findOne( { where: { id: postId } } )
                                    .then( ( post ) => {
                                        post.update( { dislikes: sequelize.literal( 'dislikes + 1' ) } )
                                        res.status( 201 ).json( { message: 'post disliked !' } )
                                    } )
                                    .catch( error => res.status( 400 ).json( { error } ) )
                            } )
                            .catch( error => {
                                res.status( 404 ).json( { error } )
                            } )
                    } )
            }
        } )
    console.log( postId )
    console.log( userId )
}

//like dislike display
exports.postLikedDisliked = ( req, res, next ) => {
    const { user_id, post_id } = req.body
    Like.findOne( { where: { post_id: post_id, user_id: user_id } } )
        .then( ( liked ) => {
            if ( liked ) {
                res.status( 200 ).json( { message: 'liked: ', liked } )
            }
            else {
                console.log( 'not liked' )
                next()
            }
        } );
    Dislike.findOne( { where: { post_id: post_id, user_id: user_id } } )
        .then( ( disliked ) => {
            if ( disliked ) {
                res.status( 200 ).json( { message: 'disliked: ', disliked } )
            }
            else {
                console.log( 'not disliked' )
                next()
            }
        } )
}

// exports.postDisliked = ( req, res ) => {
//     const { user_id, post_id } = req.body
//     Dislike.findOne( { where: { post_id: post_id, user_id: user_id } } )
//         .then( ( disliked ) => {
//             res.status( 200 ).json( disliked )
//         } )
// }
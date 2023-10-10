// import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import Likecomment from '../models/likecomment.model.js';
import Dislikecomment from '../models/dislikecomment.model.js';
import { db } from '../models/db.js';

//like post
const likeComment = async ( req, res ) => {
    const userId = req.auth.user_id;
    const commentId = req.params.cid;

    if ( commentId <= 0 ) {
        return res.status( 400 ).json( { message: 'invalid parameters' } )
    }
    Comment.findOne( { where: { id: commentId } } )
        .then( ( comment ) => {
            console.log( 'post found: ', comment )
        } )

    User.findOne( { where: { id: userId } } )
        .then( ( user ) => {
            console.log( 'user found: ', user.username )
        } )

    Likecomment.findOne( { where: { comment_id: commentId, user_id: userId } } )
        .then( async alreadyLiked => {
            if ( alreadyLiked ) {
                await Likecomment.destroy( { where: { comment_id: commentId, user_id: userId } } )
                    .then( () => {
                        Comment.findOne( { where: { id: commentId } } )
                            .then( ( comment ) => {
                                comment.update( { likes: db.literal( 'likes - 1' ) } )
                                res.status( 200 ).json( { message: 'comment unliked !' } )
                            } )
                            .catch( error => res.status( 400 ).json( error ) )
                    } )
                    .catch( error => {
                        console.log( 'error : ', error )
                        res.status( 404 ).json( { error } )
                    } )
            }
            else {
                Dislikecomment.findOne( { where: { comment_id: commentId, user_id: userId } } )
                    .then( async ( disliked ) => {
                        if ( disliked ) {
                            await Dislikecomment.destroy( { where: { comment_id: commentId, user_id: userId } } )
                                .then( () => {
                                    Comment.findOne( { where: { id: commentId } } )
                                        .then( ( comment ) => {
                                            comment.update( { dislikes: db.literal( 'dislikes - 1' ) } )
                                            console.log( 'comment dislike removed' )
                                        } )
                                        .catch( err => { res.status( 400 ).json( { err } ) } )
                                } )
                        }
                        await Likecomment.create( {
                            comment_id: commentId,
                            user_id: userId
                        } )
                            .then( () => {
                                Comment.findOne( { where: { id: commentId } } )
                                    .then( ( comment ) => {
                                        comment.update( { likes: db.literal( 'likes + 1' ) } )
                                        res.status( 201 ).json( { message: 'comment liked !' } )
                                    } )
                                    .catch( error => res.status( 400 ).json( { error } ) )
                            } )
                            .catch( error => {
                                res.status( 404 ).json( { error } )
                            } )
                    } )
            }
        } )
    console.log( commentId )
    console.log( userId )
}

//dislike post
const dislikeComment = async ( req, res ) => {
    const userId = req.auth.user_id;
    const commentId = req.params.cid;

    if ( commentId <= 0 ) {
        return res.status( 400 ).json( { message: 'invalid parameters' } )
    }
    Comment.findOne( { where: { id: commentId } } )
        .then( ( comment ) => {
            console.log( 'comment found: ', comment )
        } )

    User.findOne( { where: { id: userId } } )
        .then( ( user ) => {
            console.log( 'user found: ', user.username )
        } )

    Dislikecomment.findOne( { where: { comment_id: commentId, user_id: userId } } )
        .then( async alreadyDisliked => {
            if ( alreadyDisliked ) {
                await Dislikecomment.destroy( { where: { comment_id: commentId, user_id: userId } } )
                    .then( () => {
                        Comment.findOne( { where: { id: commentId } } )
                            .then( ( comment ) => {
                                comment.update( { dislikes: db.literal( 'dislikes - 1' ) } )
                                res.status( 200 ).json( { message: 'comment dislike removed !' } )
                            } )
                            .catch( error => res.status( 400 ).json( error ) )
                    } )
                    .catch( error => {
                        console.log( 'error : ', error )
                        res.status( 404 ).json( { error } )
                    } )

            }
            else {
                Likecomment.findOne( { where: { comment_id: commentId, user_id: userId } } )
                    .then( async ( liked ) => {
                        if ( liked ) {
                            await Likecomment.destroy( { where: { comment_id: commentId, user_id: userId } } )
                                .then( () => {
                                    Comment.findOne( { where: { id: commentId } } )
                                        .then( ( comment ) => {
                                            comment.update( { likes: db.literal( 'likes - 1' ) } )
                                            console.log( 'comment unliked' )
                                        } )
                                        .catch( err => { res.status( 400 ).json( { err } ) } )
                                } )
                        }
                        await Dislikecomment.create( {
                            comment_id: commentId,
                            user_id: userId
                        } )
                            .then( () => {
                                Comment.findOne( { where: { id: commentId } } )
                                    .then( ( comment ) => {
                                        comment.update( { dislikes: db.literal( 'dislikes + 1' ) } )
                                        res.status( 201 ).json( { message: 'comment disliked !' } )
                                    } )
                                    .catch( error => res.status( 400 ).json( { error } ) )
                            } )
                            .catch( error => {
                                res.status( 404 ).json( { error } )
                            } )
                    } )
            }
        } )
    console.log( commentId )
    console.log( userId )
}

//like dislike display
const commentLikedDisliked = ( req, res, next ) => {
    const comment_id = req.body.comment_id;
    const user_id = req.auth.user_id;
    Likecomment.findOne( { where: { comment_id: comment_id, user_id: user_id } } )
        .then( ( liked ) => {
            if ( liked ) {
                res.status( 200 ).json( { message: 'liked: ', liked } )
            }
            else {
                console.log( 'not liked' )
                Dislikecomment.findOne( { where: { comment_id: comment_id, user_id: user_id } } )
                    .then( ( disliked ) => {
                        if ( disliked ) {
                            res.status( 200 ).json( { message: 'disliked: ', disliked } )
                        }
                        else {
                            console.log( 'not disliked' )
                            res.status( 200 ).json( { message: 'none found' } )
                        }
                    } );
            }
        } )
        .catch( err => res.status( 500 ).json( { err } ) )
};

export { likeComment, dislikeComment, commentLikedDisliked };
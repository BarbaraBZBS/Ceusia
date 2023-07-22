import express from 'express';
const postRoutes = express.Router();
import auth from '../../middleware/auth.js';
// const multer = require( '../../middleware/multer-config' );
import * as postCtrl from '../controllers/post.controller.js';
import * as likeCtrl from '../controllers/like.controller.js';


// Create a new Post
postRoutes.post( "/", auth, postCtrl.createPost ); // multer,

// Retrieve all Posts
postRoutes.get( "/", auth, postCtrl.getAllPosts );

// Retrieve a single Post with id
postRoutes.get( "/:id", auth, postCtrl.findOnePost );

// Update a Post with id
postRoutes.put( "/:id", auth, postCtrl.updatePost );//multer,

// Delete a Post with id
postRoutes.delete( "/:id", auth, postCtrl.deletePost );

// Like - dislike Post
postRoutes.post( "/:id/like", auth, likeCtrl.likePost );

postRoutes.post( "/:id/dislike", auth, likeCtrl.dislikePost );

postRoutes.post( "/likestatus", likeCtrl.postLikedDisliked );
// router.post/patch( "/disliked", auth??, postCtrl.postDisliked );


export default postRoutes;
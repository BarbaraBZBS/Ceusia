import express from 'express';
const postRoutes = express.Router();
import auth from '../../middleware/auth.js';
import multer from 'multer';
const upload = multer( {
    limits: {
        fileSize: 4000 * 1024 * 1024,
        fieldSize: 4000 * 1024 * 1024.
    }
} );
import * as postCtrl from '../controllers/post.controller.js';
import * as likeCtrl from '../controllers/like.controller.js';


// Create a new Post
postRoutes.post( "/", auth, upload.single( 'fileUrl' ), postCtrl.createPost );

// Retrieve all Posts
postRoutes.get( "/", auth, postCtrl.getAllPosts ); // 

// Retrieve a single Post with id
postRoutes.get( "/:id", auth, postCtrl.findOnePost );

// Update a Post with id
postRoutes.put( "/:id", auth, upload.single( 'fileUrl' ), postCtrl.updatePost );

// Delete a Post with id
postRoutes.delete( "/:id", auth, postCtrl.deletePost );

// Like - dislike Post
postRoutes.post( "/:id/like", auth, likeCtrl.likePost );

postRoutes.post( "/:id/dislike", auth, likeCtrl.dislikePost );

postRoutes.post( "/likestatus", likeCtrl.postLikedDisliked );
// router.post/patch( "/disliked", auth??, postCtrl.postDisliked );


export default postRoutes;
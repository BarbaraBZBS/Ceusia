const express = require( 'express' );
const router = express.Router();
// const multer = require( '../middleware/multer-config' );
const postCtrl = require( '../controllers/post.controller' );



// Create a new Post
router.post( "/", postCtrl.createPost );

// Retrieve all Posts
router.get( "/", postCtrl.getAllPosts );

// Retrieve a single Post with id
router.get( "/:id", postCtrl.findOnePost );

// Update a Post with id
router.put( "/:id", postCtrl.updatePost );

// Delete a Post with id
router.delete( "/:id", postCtrl.deletePost );

// Like Post
// router.post( "/:id/like", postCtrl.likeUnlikePost );
// router.post( '/liked', postCtrl.postLiked );

module.exports = router;
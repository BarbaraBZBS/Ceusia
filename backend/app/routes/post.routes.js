const express = require( 'express' );
const router = express.Router();
const auth = require( '../../middleware/auth' );
const multer = require( '../../middleware/multer-config' );
const postCtrl = require( '../controllers/post.controller' );



// Create a new Post
router.post( "/", auth, multer, postCtrl.createPost );

// Retrieve all Posts
router.get( "/", auth, postCtrl.getAllPosts );

// Retrieve a single Post with id
router.get( "/:id", auth, postCtrl.findOnePost );

// Update a Post with id
router.put( "/:id", auth, multer, postCtrl.updatePost );

// Delete a Post with id
router.delete( "/:id", auth, postCtrl.deletePost );

// Like Post
// router.post( "/:id/like", auth, postCtrl.likeUnlikePost );
// router.post( '/liked', auth??, postCtrl.postLiked );

module.exports = router;
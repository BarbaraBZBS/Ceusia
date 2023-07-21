const express = require( 'express' );
const router = express.Router();
const auth = require( '../../middleware/auth' );
const multer = require( '../../middleware/multer-config' );
const postCtrl = require( '../controllers/post.controller' );
const likeCtrl = require( '../controllers/like.controller' );


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

// Like - dislike Post
router.post( "/:id/like", auth, likeCtrl.likePost );

router.post( "/:id/dislike", auth, likeCtrl.dislikePost );

router.post( "/likestatus", likeCtrl.postLikedDisliked );
// router.post/patch( "/disliked", auth??, postCtrl.postDisliked );


module.exports = router;
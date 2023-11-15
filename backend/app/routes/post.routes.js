import express from "express";
const postRoutes = express.Router();
import auth from "../../middleware/auth.js";
import multer from "multer";
const upload = multer({
	limits: {
		fileSize: 4000 * 1024 * 1024,
		fieldSize: 4000 * 1024 * 1024,
	},
});
import * as postCtrl from "../controllers/post.controller.js";
import * as likepostCtrl from "../controllers/likePost.controller.js";
import * as commentCtrl from "../controllers/comment.controller.js";
import * as likecommentCtrl from "../controllers/likeComment.controller.js";

// Create a new Post
postRoutes.post("/", auth, upload.single("fileUrl"), postCtrl.createPost);

// Retrieve all Posts
postRoutes.get("/all", auth, postCtrl.getAllPosts);

// Retrieve Posts by page
postRoutes.get("/", auth, postCtrl.getPosts);

// Retrieve a single Post with id
postRoutes.get("/:id", auth, postCtrl.findOnePost);

// Retrieve all posts from a single user
postRoutes.get("/user/:uid", auth, postCtrl.findUserPosts);

// Update a Post with id
postRoutes.put("/:id", auth, upload.single("fileUrl"), postCtrl.updatePost);

// Delete a Post with id
postRoutes.delete("/:id", auth, postCtrl.deletePost);

// Like - dislike Post
postRoutes.post("/:id/like", auth, likepostCtrl.likePost);

postRoutes.post("/:id/dislike", auth, likepostCtrl.dislikePost);

postRoutes.post("/likestatus", auth, likepostCtrl.postLikedDisliked);
// router.post/patch( "/disliked", auth??, postCtrl.postDisliked );

// Post comments
postRoutes.post(
	"/:id/comment",
	auth,
	upload.single("image"),
	commentCtrl.createComment
);

postRoutes.get("/:id/comments", auth, commentCtrl.getAllPostComments);

postRoutes.get("/:id/comment/:cid", auth, commentCtrl.findOnePostComment);

postRoutes.put(
	"/:id/comment/:cid",
	auth,
	upload.single("image"),
	commentCtrl.updateComment
);

postRoutes.delete("/:id/comment/:cid", auth, commentCtrl.deleteComment);

// Like - dislike Post comment
postRoutes.post("/comment/:cid/like", auth, likecommentCtrl.likeComment);

postRoutes.post("/comment/:cid/dislike", auth, likecommentCtrl.dislikeComment);

postRoutes.post(
	"/commentlikestatus",
	auth,
	likecommentCtrl.commentLikedDisliked
);

export default postRoutes;

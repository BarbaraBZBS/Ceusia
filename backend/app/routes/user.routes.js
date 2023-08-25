import express from 'express'
const userRoutes = express.Router();
import * as userCtrl from "../controllers/user.controller.js";
import * as uploadCtrl from "../controllers/upload.controller.js";
import auth from '../../middleware/auth.js';
import multer from 'multer';
const upload = multer();

// new User signup
userRoutes.post( "/signup", userCtrl.signup );

// User login
userRoutes.post( "/login", userCtrl.login );

// User logout
userRoutes.get( "/logout", userCtrl.logout );

//User refresh token
userRoutes.post( "/refresh", userCtrl.refreshUserToken );

// Retrieve all Users
userRoutes.get( "/users", auth, userCtrl.getAllUsers );

// Retrieve a single User with id
userRoutes.get( "/user/:id", auth, userCtrl.findOneUser );

// Update User with id
userRoutes.put( "/user/:id", auth, userCtrl.updateUser );

// Delete User with id
userRoutes.delete( "/user/:id", auth, userCtrl.deleteUser );

// User profile image handle
userRoutes.post( "/upload", auth, upload.single( 'picture' ), uploadCtrl.userPicture );

//User following
userRoutes.post( "/follow/:id", userCtrl.followUser ); //or patch
userRoutes.post( "/unfollow/:id", userCtrl.unfollowUser ); //or patch

export default userRoutes;
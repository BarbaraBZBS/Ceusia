const userCtrl = require( "../controllers/user.controller.js" );
const router = require( "express" ).Router();

// new User signup
router.post( "/signup", userCtrl.signup );

// User login
router.post( "/login", userCtrl.login );

// User logout
router.get( "/logout", userCtrl.logout );

// Retrieve all Users
router.get( "/users", userCtrl.getAllUsers );

// Retrieve a single User with id
router.get( "/user/:id", userCtrl.findOneUser );

// Update User with id
router.put( "/user/:id", userCtrl.updateUser );

// Delete User with id
router.delete( "/user/:id", userCtrl.deleteUser );

module.exports = router;
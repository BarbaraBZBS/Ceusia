module.exports = app => {
    const posts = require( "../controllers/post.controller.js" );

    var router = require( "express" ).Router();

    // Create a new Post
    router.post( "/", posts.create );

    // Retrieve all Posts
    router.get( "/", posts.findAll );

    // Retrieve a single Post with id
    router.get( "/:id", posts.findOne );

    // Update a Post with id
    router.put( "/:id", posts.update );

    // Delete a Tutorial with id
    router.delete( "/:id", posts.delete );

    // Delete all Tutorials
    router.delete( "/", posts.deleteAll );

    app.use( '/api/post', router );
};
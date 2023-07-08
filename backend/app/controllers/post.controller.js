const Post = require( "../models/post.model.js" );

// Create and Save a new Post
exports.create = ( req, res ) => {
    // Validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }

    // Create a Post
    const post = new Post( {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        videoUrl: req.body.videoUrl,
        musicUrl: req.body.musicUrl,
        user_id: 1
    } );

    // Save post in the database
    Post.create( post, ( err, data ) => {
        if ( err )
            res.status( 500 ).send( {
                message:
                    err.message || "Some error occurred while creating the post."
            } );
        else res.send( data );
    } );

};

// Retrieve all Posts from the database (with condition).
exports.findAll = ( req, res ) => {
    const content = req.query.content;

    Post.getAll( content, ( err, data ) => {
        if ( err )
            res.status( 500 ).send( {
                message:
                    err.message || "Some error occurred while retrieving posts."
            } );
        else res.send( data );
    } );
};

// Find a single Post with a id
exports.findOne = ( req, res ) => {
    Post.findById( req.params.id, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `Not found Post with id ${ req.params.id }.`
                } );
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving Post with id " + req.params.id
                } );
            }
        } else res.send( data );
    } );
};

// Update a Post identified by the id in the request
exports.update = ( req, res ) => {
    // Validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }

    console.log( req.body );

    Post.updateById(
        req.params.id,
        new Post( req.body ),
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found Post with id ${ req.params.id }, ${ res.affectedRows }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating Post with id " + req.params.id
                    } );
                }
            } else {
                res.send( data );
            }
        }
    );
};

// Delete a Post with the specified id in the request
exports.delete = ( req, res ) => {
    Post.remove( req.params.id, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `Not found Post with id ${ req.params.id }.`
                } );
            } else {
                res.status( 500 ).send( {
                    message: "Could not delete Post with id " + req.params.id
                } );
            }
        } else res.send( { message: `Post was deleted successfully!` } );
    } );
};

// Delete all Posts from the database.
exports.deleteAll = ( req, res ) => {
    Post.removeAll( ( err, data ) => {
        if ( err )
            res.status( 500 ).send( {
                message:
                    err.message || "Some error occurred while removing all Posts."
            } );
        else res.send( { message: `All Posts were deleted successfully!` } );
    } );
};
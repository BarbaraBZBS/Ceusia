const sql = require( "./db.js" );

// constructor
class Post {
    constructor( post ) {
        this.title = post.title;
        this.content = post.content;
        this.imageUrl = post.imageUrl;
        this.videoUrl = post.videoUrl;
        this.musicUrl = post.musicUrl;
        //to be updated
        this.user_id = 1;
    }
    static create( newPost, result ) {
        sql.query( "INSERT INTO post SET ?", newPost, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( err, null );
                return;
            }

            console.log( "created post: ", { id: res.insertId, ...newPost } );
            result( null, { id: res.insertId, ...newPost } );
        } );
    }
    static findById( id, result ) {
        sql.query( `SELECT * FROM post WHERE id = ${ id }`, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( err, null );
                return;
            }

            if ( res.length ) {
                console.log( "found post: ", res[ 0 ] );
                result( null, res[ 0 ] );
                return;
            }

            // not found Tutorial with the id
            result( { kind: "not_found" }, null );
        } );
    }
    static getAll( result ) {
        let query = "SELECT * FROM post";
        sql.query( query, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            console.log( "posts: ", res );
            result( null, res );
        } );
    }
    static updateById( id, post, result ) {
        sql.query(
            "UPDATE post SET title = ?, content = ?, imageUrl = ?, videoUrl = ?, musicUrl = ?, likes = ?, user_id = ? WHERE id = ?",
            [ post.title, post.content, post.imageUrl, post.videoUrl, post.musicUrl, post.likes, post.user_id, id ],
            ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( null, err );
                    return;
                }
                if ( res.affectedRows == 0 ) {
                    // not found Post with the id
                    result( { kind: "not_found" }, null );
                    return;
                }

                console.log( "updated post: ", { id: id, ...post } );
                result( null, { id: id, ...post } );
            }
        );
    }
    static remove( id, result ) {
        sql.query( "DELETE FROM post WHERE id = ?", id, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            if ( res.affectedRows == 0 ) {
                // not found Post with the id
                result( { kind: "not_found" }, null );
                return;
            }

            console.log( "deleted post with id: ", id );
            result( null, res );
        } );
    }
    static removeAll( result ) {
        sql.query( "DELETE FROM post", ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            console.log( `deleted ${ res.affectedRows } posts` );
            result( null, res );
        } );
    }
}


module.exports = Post;
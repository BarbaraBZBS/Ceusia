const express = require( "express" );
require( 'dotenv' ).config();
const db = require( './app/models/db' );
const path = require( 'path' );
const cors = require( "cors" );
const cookieParser = require( 'cookie-parser' );

const userRoutes = require( './app/routes/user.routes' );
const postRoutes = require( './app/routes/post.routes' );


const app = express();

var corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: [ "sessionId", "Content-Type" ],
    exposedHeaders: [ "sessionId" ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use( cors( corsOptions ) );

// parse requests of content-type - application/json
app.use( express.json() );

// parse requests of content-type - application/x-www-form-urlencoded
app.use( express.urlencoded( { extended: true } ) );

app.use( cookieParser() );

// simple route
app.get( "/", ( req, res ) => {
    res.json( { message: "Welcome to ceusia api." } );
} );
//require( "./app/routes/post.routes.js" )( app )

db.sequelize.sync()
    .then( () => {
        console.log( 'synced db' );
    } )
    .catch( ( err ) => {
        console.log( "Failed to sync db:" + err.message )
    } );

app.use( '/images', express.static( path.join( __dirname, 'images' ) ) );
app.use( '/api/auth', userRoutes );
app.use( '/api/posts', postRoutes );

module.exports = app;
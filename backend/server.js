const express = require( "express" );
const cors = require( "cors" );
require( 'dotenv' ).config();
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

// simple route
app.get( "/", ( req, res ) => {
    res.json( { message: "Welcome to ceusia api." } );
} );

require( "./app/routes/post.routes.js" )( app );

// set port, listen for requests
const PORT = process.env.PORT;
app.listen( PORT, () => {
    console.log( `Server is running on port ${ PORT }.` );
} );
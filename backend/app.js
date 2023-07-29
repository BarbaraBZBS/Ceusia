// const express = require( "express" );
import express from 'express';
import { } from 'dotenv/config';
// require( 'dotenv' ).config();
import { db, connectToDb } from './app/models/db.js';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

import cors from "cors";
import cookieParser from 'cookie-parser';

import userRoutes from './app/routes/user.routes.js';
import postRoutes from './app/routes/post.routes.js';


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

db.sync()
    .then( () => {
        console.log( 'synced db' );
    } )
    .catch( ( err ) => {
        console.log( "Failed to sync db:" + err.message )
    } );

app.use( '/profile', express.static( path.join( `${ __dirname }`, '/app', '/public', '/files', '/profile' ) ) );
app.use( '/image', express.static( path.join( `${ __dirname }`, '/app', '/public', '/files', '/post' ) ) );
app.use( '/video', express.static( path.join( `${ __dirname }`, '/app', '/public', '/files', '/post' ) ) );
app.use( '/audio', express.static( path.join( `${ __dirname }`, '/app', '/public', '/files', '/post' ) ) );
app.use( '/api/auth', userRoutes );
app.use( '/api/posts', postRoutes );

export { app };
// module.exports = app;
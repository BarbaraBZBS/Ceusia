import User from "../models/user.model.js";
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify( stream.pipeline );
import path from 'path';
import * as url from 'url';
// const __filename = url.fileURLToPath( import.meta.url );
const __dirname = url.fileURLToPath( new URL( '..', import.meta.url ) );
// const __dirname = path.dirname( __filename );


const userPicture = async ( req, res, next ) => {
    console.log( req.file )
    try {
        if ( req.file.detectedFileExtension !== '.jpg' &&
            req.file.detectedFileExtension !== '.jpeg' &&
            req.file.detectedFileExtension !== '.png' &&
            req.file.detectedFileExtension !== '.gif' ) {
            return res.status( 400 ).json( { message: "Bad image type." } );
        };
        if ( req.file.size > 500000 ) {
            return res.status( 400 ).json( { message: "Max size reached" } );
        };

        const fileName = req.body.username + Date.now() + req.file.detectedFileExtension;
        await pipeline( req.file.stream, fs.createWriteStream(
            path.join( __dirname, '/public', '/images', '/profile', '/', fileName
            ) ) )
        res.send( "picture uploaded as " + fileName )

        //remove profile pic, when updating, with fs.unlinkSync or add default picture back
    }
    catch ( err ) {
        res.status( 500 ).json( { message: err } )
    }
};

export { userPicture };
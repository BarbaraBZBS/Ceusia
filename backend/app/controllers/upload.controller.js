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
        let imagePath = '';
        if ( !req.file.detectedMimeType.startsWith( 'image' ) ) {
            return res.status( 409 ).json( { message: "Bad image type" } );
        }
        else if ( req.file.size > 800000 ) {
            return res.status( 409 ).json( { message: "Max size reached" } );
        }
        else {
            await User.findOne( { where: { id: req.auth.user_id } } )
                .then( async ( user ) => {
                    console.log( user )
                    if ( !user ) {
                        return res.status( 404 ).json( { message: "User not found" } )
                    }
                    else {
                        if ( user.picture !== 'http://localhost:8000/profile/defaultUser.png' ) {
                            const oldFile = user.picture.split( '/profile/' )[ 1 ];
                            console.log( 'old picture: ', oldFile );
                            fs.unlinkSync( `app/public/files/profile/${ oldFile }` );
                        }
                        const fileName = user.username + Date.now() + req.file.detectedFileExtension;
                        imagePath = `${ req.protocol }://${ req.get( 'host' ) }/profile/${ fileName }`
                        await pipeline( req.file.stream, fs.createWriteStream(
                            path.join( __dirname, '/public', '/files', '/profile', '/', fileName
                            ) ) )
                        await user.update( { picture: imagePath } )
                            .then( () => {
                                console.log( imagePath )
                                res.status( 200 ).json( { message: 'user picture updated' } )
                            } )
                            .catch( err => res.status( 400 ).json( { err } ) )
                    }
                } )
                .catch( err => res.status( 400 ).json( { err } ) )
        }
    }
    catch ( err ) {
        res.status( 500 ).json( { message: err } )
    }
};

export { userPicture };
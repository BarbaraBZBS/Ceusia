import User from "../models/user.model.js";
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify( stream.pipeline );
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath( new URL( '..', import.meta.url ) );


const userPicture = async ( req, res, next ) => {
    // console.log( 'req file: ', req.file )
    try {
        let imagePath = '';
        if ( !req.file ) {
            await User.findByPk( req.params.id )
                .then( async ( user ) => {
                    if ( req.auth.role != 'admin' && user.id != req.auth.user_id ) {
                        return res.status( 401 ).json( { message: 'Unauthorized' } )
                    }
                    if ( req.body.picture == '' ) {
                        await user.update( { picture: 'http://localhost:8000/profile/defaultUser.png' } )
                            .then( () => {
                                res.status( 200 ).json( { message: 'updated and restored default picture' } )
                            } )
                            .catch( err => res.status( 400 ).json( { err } ) )
                    }
                    else {
                        return res.status( 400 ).json( { message: 'Upload Error' } )
                    }
                } )
        }
        else {
            if ( req.file.detectedMimeType === null ) {
                return res.status( 403 ).json( { message: "Bad image type" } );
            }
            else if ( !req.file.detectedMimeType.startsWith( 'image' ) ) {
                return res.status( 403 ).json( { message: "Bad image type" } );
            }
            else if ( req.file.size > 8000000 ) {
                return res.status( 409 ).json( { message: "Max size reached" } );
            }
            else {
                await User.findByPk( req.params.id )
                    .then( async ( user ) => {
                        if ( req.auth.role != 'admin' && user.id != req.auth.user_id ) {
                            return res.status( 401 ).json( { message: 'Unauthorized' } )
                        }
                        console.log( 'user: ', user )
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
                                    console.log( 'imagepath: ', imagePath )
                                    res.status( 200 ).json( { message: 'user picture updated' } )
                                } )
                                .catch( err => res.status( 400 ).json( { err } ) )
                        }
                    } )
                    .catch( err => {
                        res.status( 400 ).json( { err } )
                    } )
            }
        }
    }
    catch ( err ) {
        res.status( 500 ).json( { message: err } )
    }
};

export { userPicture };
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// const Role = require( '../models/role' );

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,35})$/;

const signup = ( req, res, next ) => {
    if ( req.body.email == null || req.body.password == null ) {
        return res.status( 400 ).json( { message: 'empty field(s)' } )
    }

    if ( req.body.username.length >= 16 || req.body.username.length <= 3 ) {
        return res.status( 400 ).json( { message: 'username must be 4 to 15 characters.' } )
    }

    if ( !EMAIL_REGEX.test( req.body.email ) ) {
        return res.status( 400 ).json( { message: 'invalid email' } )
    }

    if ( !PASSWORD_REGEX.test( req.body.password ) ) {
        return res.status( 400 ).json( { message: 'password must be 6 to 35 characters and contain at least 1 number and 1 letter.' } )
    }

    bcrypt.hash( req.body.password, 15 )
        .then( hash => {
            User.create( { username: req.body.username, email: req.body.email, password: hash } )
                .then( user => {
                    // if ( req.body.role ) {
                    //     user.update( {
                    //         role: req.body.role
                    //     } )
                    //     Role.findAll( { where: { name: req.body.role } } )
                    //         .then( role => {
                    //             user.setRoles( role ).then( () => {
                    //                 res.send( { message: 'Utilisateur enregistré avec succès' } )
                    //             } );
                    //         } );
                    // }
                    // else {
                    //     //user role 1
                    //     user.update( {
                    //         role: "user"
                    //     } )
                    //     user.setRoles( [ 1 ] ).then( () => {
                    res.status( 200 ).json( user ); //remove with user roles
                    // add this with user roles -- res.send( { message: 'User registered successfully' } );
                    //         } )
                    //     }
                } )
                .catch( error => {
                    res.status( 500 ).send( { message: error.message } )
                } )
        } )
        .catch( error => res.status( 400 ).json( { error } ) )
};

const login = async ( req, res, next ) => {
    const maxAge = 3 * 24 * 60 * 60 * 1000;
    console.log( req.body.email )
    console.log( req.body.password )
    try {
        const user = await User.findOne( { where: { email: req.body.email } } )
        console.log( req.body.email )
        console.log( user )
        if ( !user ) {
            return res.status( 401 ).json( { message: 'incorrect login details' } );
        }
        await bcrypt.compare( req.body.password, user.password )
            .then( valid => {
                if ( !valid ) {
                    return res.status( 401 ).json( { message: 'incorrect login details' } );
                }

                const token = jwt.sign(
                    {
                        user_id: user.id,
                        // role: user.role
                    },
                    process.env.SECRET_TOKEN,
                    { expiresIn: maxAge }
                )
                res.cookie( 'jwt', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 } )

                res.status( 200 ).json( {
                    user_id: user.id,
                    // role: user.role,
                    token: jwt.sign(
                        {
                            user_id: user.id,
                            // role: user.role
                        },
                        process.env.SECRET_TOKEN,
                        { expiresIn: maxAge }
                    ),
                } );
                // console.log( user.role )

                // const authorities = [];
                // user.getRoles().then( roles => {
                //     for ( let i = 0; i < roles.length; i++ ) {
                //         authorities.push( "ROLE_" + roles[ i ].name.toUpperCase() );
                //     }
                //     console.log( authorities )
                // } );
            } )
            .catch( error => {
                console.log( 'error where?', res.cookie )
                res.status( 500 ).json( { error } )
            } );
    }
    catch ( error ) {
        console.log( 'error finder: ', error.message )
        res.status( 500 ).json( { error } );
    }
};

const logout = async ( req, res, next ) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if ( !cookies?.jwt ) return res.sendStatus( 204 ); //No content
    const token = cookies.jwt;
    const user = await User.findOne( { token } )
    if ( !user ) {
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
        return res.sendStatus( 204 );
    }
    user.update( { token: '' } )
    console.log( token );
    res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
    res.sendStatus( 204 );
};

// Retrieve all Users from the database (with condition).
const getAllUsers = ( req, res, next ) => {
    User.findAll( {
        attributes: { exclude: [ 'password' ] }
    } ) //not an issue on front?
        .then( ( users ) => {
            if ( users ) {
                res.status( 200 ).json( users )
            }
            else {
                res.status( 404 ).json( { message: 'No users found' } )
            }
        } )
        .catch( error => res.status( 400 ).json( { error } ) )
};

// Find a single User with an id
const findOneUser = async ( req, res, next ) => {
    await User.findByPk( req.params.id, {
        attributes: { exclude: [ 'password' ] }
    } )
        .then( ( user ) => {
            if ( user ) {
                res.status( 200 ).json( user )
            }
            else {
                res.status( 404 ).json( { message: 'User not found' } )
            }
        } )
        .catch( error => res.status( 400 ).json( { error } ) )
};

// Update a User identified by the id in the request
const updateUser = async ( req, res ) => {
    // if ( req.body.email == null || req.body.password == null ) {
    //     return res.status( 400 ).json( { message: 'empty field(s)' } )
    // }
    await User.findByPk( req.params.id )
        .then( ( user ) => {
            if ( !user ) {
                res.status( 404 ).json( { message: 'User not found' } )
            }
            else {
                if ( req.body.password ) {
                    if ( !PASSWORD_REGEX.test( req.body.password ) ) {
                        return res.status( 409 ).json( { message: 'password must be 6 to 35 characters and contain at least 1 number and 1 letter.' } )
                    }
                    bcrypt.hash( req.body.password, 15 )
                        .then( hash => {
                            user.update( { password: hash } )
                                .then( () => {
                                    res.status( 200 ).json( { message: 'success: user password modified.' } )
                                } )
                                .catch( err => res.status( 500 ).send( { message: err.message } ) );
                        } )
                        .catch( err => res.status( 400 ).json( { err } ) )
                }
                else if ( req.body.username ) {
                    if ( req.body.username.length <= 4 || req.body.username.length >= 16 ) {
                        return res.status( 409 ).json( { message: 'username must be 4 to 15 characters.' } )
                    }
                    else {
                        user.update( { username: req.body.username } )
                            .then( () => {
                                console.log( req.body.username )
                                res.status( 200 ).json( { message: 'Success: username modified.' } )
                            } )
                            .catch( err => {
                                console.log( 'error: ', err )
                                res.status( 400 ).json( { message: err } )
                            } )
                    }
                }
                else if ( req.body.email ) {
                    if ( !EMAIL_REGEX.test( req.body.email ) ) {
                        return res.status( 409 ).json( { message: 'invalid email' } )
                    }
                    else {
                        user.update( { email: req.body.email } )
                            .then( () => {
                                console.log( req.body.email )
                                res.status( 200 ).json( { message: 'Success: user email modified.' } )
                            } )
                            .catch( err => {
                                console.log( 'error: ', err )
                                res.status( 400 ).json( { message: err } )
                            } )
                    }
                }
            }
        } )
        .catch( error => res.status( 500 ).json( { error } ) )
};

// Delete a Post with the specified id in the request
const deleteUser = async ( req, res, next ) => {
    await User.findByPk( req.params.id )
        .then( ( user ) => {
            if ( !user ) {
                res.status( 404 ).json( { message: 'User not found' } )
            }
            else {
                user.destroy()
                    .then( () => res.status( 200 ).json( { message: 'Success: user deleted !' } ) )
                    .catch( error => res.status( 400 ).json( { error } ) )
            }
        } )
        .catch( error => res.status( 400 ).json( { error } ) )
};

// // Delete all Users from the database.
// exports.deleteAll = ( req, res ) => {
//     User.removeAll( ( err, data ) => {
//         if ( err )
//             res.status( 500 ).send( {
//                 message:
//                     err.message || "Some error occurred while removing all Users."
//             } );
//         else res.send( { message: `All Users were deleted successfully!` } );
//     } );
// };

export { signup, login, logout, getAllUsers, findOneUser, updateUser, deleteUser };
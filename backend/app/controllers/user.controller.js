import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User_Follower from "../models/follower.model.js";


const USER_REGEX = /(^[a-zA-Z-_]{3,3})+([A-Za-z0-9]){1,12}$/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,35})$/;

const signup = async ( req, res, next ) => {

    if ( req.body.email == null || req.body.password == null ) {
        return res.status( 400 ).json( { message: 'empty field(s)' } )
    }
    if ( !USER_REGEX.test( req.body.username ) ) {
        return res.status( 400 ).json( { message: 'username must be 4 to 15 characters, starting with letters.' } )
    }
    if ( !EMAIL_REGEX.test( req.body.email ) ) {
        return res.status( 400 ).json( { message: 'invalid email' } )
    }
    if ( !PASSWORD_REGEX.test( req.body.password ) ) {
        return res.status( 400 ).json( { message: 'password must be 6 to 35 characters and contain at least 1 number and 1 letter.' } )
    }

    const usernameExists = await User.findOne( { where: { username: req.body.username } } );
    if ( usernameExists ) { return res.status( 409 ).json( { message: "username already taken" } ) };

    const emailExists = await User.findOne( { where: { email: req.body.email } } );
    if ( emailExists ) { return res.status( 403 ).json( { message: "email already taken" } ) };

    bcrypt.hash( req.body.password, 15 )
        .then( hash => {
            User.create( { username: req.body.username, email: req.body.email, password: hash } )
                .then( user => {
                    if ( req.body.role ) {
                        user.update( {
                            role: req.body.role
                        } )
                    }
                    res.status( 200 ).json( user );
                } )
                .catch( error => {
                    res.status( 400 ).send( { message: error.message } )
                } )
        } )
        .catch( error => res.status( 500 ).json( { error } ) )
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
            return res.status( 401 ).json( { message: 'Incorrect login details' } );
        }
        await bcrypt.compare( req.body.password, user.password )
            .then( valid => {
                if ( !valid ) {
                    return res.status( 401 ).json( { message: 'Incorrect login details' } );
                }
                const token = jwt.sign(
                    {
                        user_id: user.id,
                        role: user.role
                    },
                    process.env.SECRET_TOKEN,
                    { expiresIn: '10m' }
                );
                const refreshToken = jwt.sign(
                    {
                        user_id: user.id,
                        role: user.role
                    },
                    process.env.REFRESH_SECRET_TOKEN,
                    { expiresIn: maxAge }
                );
                console.log( 'role :', user.role )
                const sentCookie = req.cookies
                //cookie secure is changed for production
                return res
                    .cookie( 'jwt', token, { httpOnly: true, secure: false, sameSite: 'None' } )
                    .status( 200 )
                    .json( {
                        // sentCookie,
                        // user,
                        user_id: user.id,
                        username: user.username,
                        role: user.role,
                        token,
                        refreshToken,
                    } )
                // res.send( req.cookies )
            } )
            .catch( error => {
                // console.log( 'error where?', res.cookie )
                console.log( 'error where?', error )
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
    // console.log( ' 1 req cookies: ', req.cookies )
    const cookie = req.cookies;
    // const refresh = req.body.refreshToken
    // if ( refresh ) {
    //     await refresh.remove()
    // }
    // console.log( 'jwt cookies from req.cookies.jwt: ', cookie )
    if ( !cookie.jwt ) return res.sendStatus( 204 ); //No content 
    const token = cookie.jwt;
    const decodedToken = jwt.verify( token, process.env.SECRET_TOKEN );
    const user_id = decodedToken.user_id;
    // console.log( 'user id: ', user_id )
    const user = await User.findOne( { where: { id: user_id } } )
    // console.log( 'user', user )
    if ( !user ) {
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
        return res.sendStatus( 204 );
    }
    // user.update( { token: '' } )
    // console.log( token );
    res
        .clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } )
        .sendStatus( 204 )
};

const refreshUserToken = async ( req, res, next ) => {
    try {
        const refresh = req.body.refreshToken
        // const token = req.headers.authorization.split( ' ' )[ 1 ];
        const decodedRefToken = jwt.verify( refresh, process.env.REFRESH_SECRET_TOKEN );
        // const decodedToken = jwt.verify( token, process.env.SECRET_TOKEN );
        const user_id = decodedRefToken.user_id;
        // const user_id = decodedToken.user_id;
        const user = await User.findOne( { where: { id: user_id } } )
        if ( user_id === user.id ) {
            const token = jwt.sign(
                {
                    user_id: user.id,
                    role: user.role
                },
                process.env.SECRET_TOKEN,
                { expiresIn: '10m' }
            );
            res
                .cookie( 'jwt', token, { httpOnly: true, secure: false, sameSite: 'None' } )
                .status( 200 )
                .json( { token } )
        }
        else {
            res.sendStatus( 401 )
        }
    }
    catch ( err ) {
        console.log( 'error refreshing', err )
        res.status( 500 ).json( { message: 'Could not refresh token' } )
    }

}
// const removeRefresh = async (req, res, next) => {
//     const refresh = req.body.refreshToken
//     if(refresh) {
//         delete(refresh)
//     }
//         res.sendStatus(204)
// }


// Retrieve all Users from the database (with condition).
const getAllUsers = ( req, res, next ) => {
    User.findAll( {
        attributes: { exclude: [ 'password', 'role' ] }
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
        attributes: { exclude: [ 'password', 'role' ] }
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
            // console.log( user )
            if ( !user ) {
                return res.status( 404 ).json( { message: 'User not found' } )
            }
            else {
                if ( req.auth.role != 'admin' && user.id != req.auth.user_id ) {
                    // if ( user.id != req.auth.user_id ) {
                    return res.status( 401 ).json( { message: 'Unauthorized' } )
                    // }
                }
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
                else if ( req.body.motto ) {
                    user.update( { motto: req.body.motto } )
                        .then( () => {
                            console.log( req.body.motto )
                            res.status( 200 ).json( { message: 'Success: user motto modified.' } )
                        } )
                        .catch( err => {
                            console.log( 'error: ', err )
                            res.status( 400 ).json( { message: err } )
                        } )
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
                if ( req.auth.role != 'admin' && user.id != req.auth.user_id ) {
                    return res.status( 401 ).json( { message: 'Unauthorized' } )
                }
                user.destroy()
                    .then( () => res.status( 200 ).json( { message: 'Success: user deleted !' } ) )
                    .catch( error => res.status( 400 ).json( { error } ) )
            }
        } )
        .catch( error => res.status( 500 ).json( { error } ) )
};


const followUser = async ( req, res, next ) => {
    try {
        await User.findByPk( req.params.id )
            .then( ( user ) => {
                if ( !user ) {
                    return res.status( 404 ).json( { message: 'user not found' } )
                }
                User_Follower.findOne( { where: { user_id: user.id, follower_id: req.body.follower_id } } )//or req.auth.user_id if added auth to router
                    .then( async alreadyFollowed => {
                        if ( alreadyFollowed ) {
                            return res.status( 409 ).json( { message: 'cannot follow a user that is already followed' } )
                        }
                        else {
                            await User_Follower.create( {
                                user_id: user.id,
                                follower_id: req.body.follower_id //or req.auth.user_id if added auth to router
                            } )
                                .then( () => {
                                    res.status( 201 ).json( { message: 'successfully followed' } )
                                } )
                        }
                    } )
                    .catch( err => res.status( 400 ).json( { err } ) )
            } )
            .catch( err => res.status( 500 ).json( { err } ) )
    }
    catch ( err ) {
        console.log( err )
        console.log( 'following went wrong: ', res.statusCode )
        res.status( 500 ).json( { err } )
    }
}

const unfollowUser = async ( req, res, next ) => {
    try {
        await User.findByPk( req.params.id )
            .then( ( user ) => {
                if ( !user ) {
                    return res.status( 404 ).json( { message: 'user not found' } )
                }
                User_Follower.findOne( { where: { user_id: user.id, follower_id: req.body.follower_id } } ) //or req.auth.user_id if added auth to router
                    .then( ( user_follower ) => {
                        if ( !user_follower ) {
                            return res.status( 409 ).json( { message: 'cannot unfollow a user that is not already followed' } )
                        }
                        else {
                            user_follower.destroy()
                                .then( () => {
                                    res.status( 200 ).json( { messaged: 'successfully unfollowed' } )
                                } )
                                .catch( err => res.status( 400 ).json( { err } ) )
                        }
                    } )
            } )
    }
    catch ( err ) {
        console.log( err )
        console.log( 'unfollowing went wrong: ', res.statusCode )
        res.status( 500 ).json( { err } )
    }
}

export { signup, login, logout, refreshUserToken, getAllUsers, findOneUser, updateUser, deleteUser, followUser, unfollowUser };
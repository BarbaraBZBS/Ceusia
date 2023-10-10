import User_Follower from "../models/follower.model.js";
import User from "../models/user.model.js";

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
};

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
};

const getFollowersNbr = ( req, res, next ) => {
    try {
        User_Follower.findAndCountAll( { where: { user_id: req.params.id } } )
            .then( ( followers ) => {
                console.log( 'user followers amount : ', followers )
                res.status( 200 ).json( followers )
            } )
            .catch( err => res.status( 400 ).json( { err } ) )
    }
    catch ( err ) {
        console.log( "user followers not retrieved", err, res.statusCode )
        res.status( 500 ).json( { err } )
    }
};

const getFollowingNbr = async ( req, res, next ) => {
    try {
        await User_Follower.findAndCountAll( { where: { follower_id: req.params.id } } )
            .then( ( following ) => {
                console.log( 'user following amount : ', following )
                res.status( 200 ).json( following )
            } )
            .catch( err => res.status( 400 ).json( { err } ) )
    }
    catch ( err ) {
        console.log( 'user following not retrieved', err, res.statusCode )
        res.status( 500 ).json( { err } )
    }
};

//follow unfollow display
const userFollowedStatus = async ( req, res, next ) => {
    const { user_id, follower_id } = req.body
    await User_Follower.findOne( { where: { user_id: user_id, follower_id: follower_id } } )
        .then( ( followed ) => {
            if ( followed ) {
                console.log( 'followed status : ', followed )
                res.status( 200 ).json( { message: 'followed' } )
            }
            else {
                res.status( 200 ).json( { message: 'not followed' } )
            }
        } )
        .catch( err => res.status( 500 ).json( { err } ) )
};

export { followUser, unfollowUser, getFollowersNbr, getFollowingNbr, userFollowedStatus };
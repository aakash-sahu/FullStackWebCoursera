var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
//json web token authentication imports
var JwtStrategy = require('passport-jwt').Strategy; //provides json web token bases strategy
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');


//user.authrnticate is a verify fuction from PLM. ad uname, pwd should be part of body
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //required for serialized dor use in sessions
passport.deserializeUser(User.deserializeUser());

//function to create a token when a user is given to it
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600})
};

// setup stratgey for jwt
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  //once token is generated, copy it and include in authorization header as bearer token.Other ways also possible.
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); //done is the callback that passport will pass into your strategy? done takes 3 params
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

// to verify an incoming user--not creating sessions as using jwt. can be called anywhere
exports.verifyUser = passport.authenticate('jwt', {session: false})

//verify admin user
exports.verifyAdmin = (req,res,next) => {
    if (req.user.admin == true) {
        next();
    }
    else {
        var err = new Error("You are not authorized to perform this operation");
        err.status = 403;
        next(err);
    }
}

//fb oauth, if users asks to login through facebook
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
            User.findOne({facebookId: profile.id}, (err, user) => {
                if (err){
                    return done(err, false);
                }
                if(!err && user !== null) {
                    return done(null, user);
                }
                else {
                    user = new User({username: profile.displayName});
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err)
                        return done(err, false);
                        else
                        return done(null, user);
                    })
                }
            });
    }
));
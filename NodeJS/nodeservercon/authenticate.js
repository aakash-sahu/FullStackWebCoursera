var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

//user.authrnticate is a verify fuction from PLM. ad uname, pwd should be part of body
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //required for serialized dor use in sessions
passport.deserializeUser(User.deserializeUser());
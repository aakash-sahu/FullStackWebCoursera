//Set up the users model to create user types and use in express sessions
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
//passport local mongoose automatically adds username and password to the schema
// and encrypts in the mongo db schema

var User = Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
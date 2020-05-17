//Set up the users model to create user types and use in express sessions
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', User);
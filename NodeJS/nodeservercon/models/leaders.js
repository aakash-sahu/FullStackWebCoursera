const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//define schema
const leaderSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

//create collection
var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;

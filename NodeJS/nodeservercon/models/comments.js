const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//deleting the comments schema and moving to comments schema as in react client the comments are separate and include dish id
//define the schema for documents
const commentSchema = Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //using mongoose population to refer to User model
        ref: 'User'
    },
    //now comments refer to dish
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
    }, {
        timestamps: true
    }
);

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;
//models for all collections
//dishes model

const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose); //to include currency as one of data type in the mongodb/mongoose
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

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
    }
    }, {
        timestamps: true
    }
);

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        required: false
    },
    comments: [commentSchema]
}, {
    timestamps: true //adding this automatically adds createdat and updatedat to schema
}  
);

var Dishes = mongoose.model('Dish', dishSchema); //mongoose creates collection with plural of the model name

module.exports = Dishes;
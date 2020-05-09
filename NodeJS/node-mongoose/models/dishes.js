//models for all collections
//dishes model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true //adding this automatically adds createdat and updatedat to schema
}  
);

var Dishes = mongoose.model('Dish', dishSchema); //mongoose creates collection with plural of the model name

module.exports = Dishes;
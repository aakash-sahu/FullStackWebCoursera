//add favotire dishes using mongoose population

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoriteSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
});

module.exports = mongoose.model('Favorite',favoriteSchema);
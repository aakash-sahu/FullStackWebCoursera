const mongoose = require('mongoose');

const Dishes= require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';  //connec to confusion database
const connect = mongoose.connect(url);

//connection object reuturns a promise
connect.then((db) => {

    console.log('Connected correctly to the server');
    Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    })
    .then((dish) => {
        console.log(dish.toJSON());
        
        // find by the ID of dish just inserted and update
        return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'Updated test'}
        }, {
            new: true //this flag so once update done return updated dish
        })
        .exec();  
    })
    .then((dish) => {
        console.log(dish.toJSON());

        //use push to push an item into comment array
        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling',
            author: 'Leonardo di Carpaccio'
        });
        return dish.save();
    })
    .then((dish) => {
        console.log(dish.toJSON())

        return Dishes.remove({}); //deletes all the items
    })
    .then(()=> {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log('CAUGHT ERROR IN INNER PROMISE');
        console.log(err)
    });
    
})
.catch((err) => {
    console.log('CAUGHT ERROR IN CONNECTION');
    console.log(err);
});
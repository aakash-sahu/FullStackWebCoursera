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
        console.log(dish);
        
        return Dishes.find({}).exec();  //to find all items in the collection. Exec ensures operation is executed.
    })
    .then((dishes) => {
        console.log(dishes);

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
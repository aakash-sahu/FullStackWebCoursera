const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//add Dishes schema to refer to the dishes data in mongodb
const Dishes = require('../models/dishes');

//initiate dish router
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// Chained routers
// API + db - remove .all and respond to each request separately
dishRouter.route('/')
.get( (req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes); //add dishes to the response variable in json format
    }, (err) => next(err))
    .catch((err) => next(err)) //pass on the error for error handling later in the process
})
.post((req,res,next) => {
    Dishes.create(req.body) // create a new document with body of the request
    .then((dish) => {
        console.log('Dish created', dish.toJSON());
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
    })
.put( (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
    Dishes.remove({}) //removes all the documents in the schema
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

//router for individual dishes
dishRouter.route('/:dishId')
.get( (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post((req,res,next) => {
    res.statusCode = 403 //HTTP code for not supported
    res.end('Post operation not supported on /dishes/'+ req.params.dishId);
})
.put( (req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true}) //new:true make update function return the updated document
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.delete((req,res,next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

module.exports = dishRouter;
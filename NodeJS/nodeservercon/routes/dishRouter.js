const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

//add Dishes schema to refer to the dishes data in mongodb
const Dishes = require('../models/dishes');

//initiate dish router
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// Chained routers
// API + db - remove .all and respond to each request separately
dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) // apply to route for when request is preflighted server check and responds before client sends the data
//apply cors middleware
.get(cors.cors, (req,res,next) => {
    Dishes.find(req.query)
    .populate('comments.author') //call to populate author field
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes); //add dishes to the response variable in json format
    }, (err) => next(err))
    .catch((err) => next(err)) //pass on the error for error handling later in the process
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => { //adding multiple middleware in order
    Dishes.create(req.body) // create a new document with body of the request
    .then((dish) => {
        console.log('Dish created', dish.toJSON());
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
    })
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
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
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get( (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,  (req,res,next) => {
    res.statusCode = 403 //HTTP code for not supported
    res.end('Post operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

module.exports = dishRouter;
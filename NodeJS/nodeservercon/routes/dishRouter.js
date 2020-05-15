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
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

//code block for all the comments for a dish
dishRouter.route('/:dishId/comments')
.get( (req,res,next) => {
    Dishes.findById(req.params.dishId) //first find the dish and check if it's available in the db
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments); //add comments to the response variable in json format
        }
        else {
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //the error is handled in the app.js 
        }
    }, (err) => next(err))
    .catch((err) => next(err)) //pass on the error for error handling later in the process
})
.post((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=> {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments); //add comments to the response variable in json format
            }, (err) => next(err))
        }
        else {
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //the error is handled in the app.js 
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
    })
.put( (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments');
})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId) //first find the dish and check if it's available in the db
    .then((dish) => {
        if (dish != null) {
            // loop through the comments and delete each comment one by one
            // as no method to delete the entire subdocument
            for (var i = (dish.comments.length -1); i >=0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            //alternative -- replace the for code with this "dish.comments = [];" -- it'll replace the subdocument to empty array.
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
        }
        else {
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //the error is handled in the app.js 
        } 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

//router for individual comments
dishRouter.route('/:dishId/comments/:commentId')
.get( (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //checking if both dish is not null as well comments should notbe null to proceed
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId)); //add comments to the response variable in json format
        }
        else if (dish == null) {
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //the error is handled in the app.js 
        }
        else {
            err = new Error('Dish '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);     
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post((req,res,next) => {
    res.statusCode = 403 //HTTP code for not supported
    res.end('Post operation not supported on /dishes/'+ req.params.dishId+'/comments'+ req.params.dishId);
})
.put( (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //checking if both dish is not null as well comments should notbe null to proceed
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            //allowing to change only the rating and the comment, not author
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish); 
            }, (err) => next(err))
        }
        else if (dish == null) {
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //the error is handled in the app.js 
        }
        else {
            err = new Error('Dish '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);     
        } 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //checking if both dish is not null as well comments should notbe null to proceed
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish); //add comments to the response variable in json format
            }, (err) => next(err))
        }
        else if (dish == null) {
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); //the error is handled in the app.js 
        }
        else {
            err = new Error('Dish '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);     
        } 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

module.exports = dishRouter;
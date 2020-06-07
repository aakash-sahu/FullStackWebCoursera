//creating new router for comments as react client has separate end point for comments
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Comments = require('../models/comments');

const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Comments.find(req.query) 
    .populate('author')
    .then((comments) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(comments); 
    }, (err) => next(err))
    .catch((err) => next(err)) //pass on the error for error handling later in the process
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    if (req.body != null) {
        // rating, comments, and dish info should already be part of body
        req.body.author = req.user._id //get id of currently logged user
        Comments.create(req.body)
        .then((comment) => {
            Comments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            })
        }, (err) => next(err))
        .catch((err) => next(err));       
    }
    else {
        err = new Error('Comment not found in request body');
        err.status= 404;
        return next(err);
    }
    })
.put(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments/');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    Comments.remove({}) //remove all comments!!
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

//router for individual comments
commentRouter.route('/:commentId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(comment); 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403 //HTTP code for not supported
    res.end('Post operation not supported on /comments/'+ req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
            if (!comment.author.equals(req.user._id)) {
                err = new Error('You can modify only your comment!')
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id
            Comments.findByIdAndUpdate(req.params.commentId, { //which to update
                $set: req.body  //update to what
            }, {new: true}) //return the updated document
            .then((comment) => {
                Comments.findById(comment._id)
                .populate('author')
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(comment); 
                })
            }, (err) => next(err))
        }
        else {
            err = new Error('Dish '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);     
        } 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
            if (!comment.author.equals(res.user._id)) {
                err = new Error('You can delete only your comment!')
                err.status = 403;
                return next(err);
            }
            Comments.findByIdAndRemove(req.params.commentId) 
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err)) 
        }
        else {
            err = new Error('Comment '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);     
        } 
    }, (err) => next(err))
    .catch((err) => next(err)) 
});

module.exports = commentRouter;

//for comments as subdocument of dishes, need to modify react client
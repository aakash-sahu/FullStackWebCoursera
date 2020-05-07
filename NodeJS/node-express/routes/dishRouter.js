const express = require('express');
const bodyParser = require('body-parser');

//initiate dish router
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// Chained routers
dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get( (req,res,next) => {
    res.end("Will send all the dishes to you")
})
.post((req,res,next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details '+ req.body.description);
})
.put( (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
    res.end("Deleting all the dishes");
});

//router for individual dishes
dishRouter.route('/:dishId')
.all((req,res,next) => {
    //no matter which request get,put,post,delete...this will be executed first
    res.statusCode = 200; //HTTP code for success
    res.setHeader('Content-Type', 'text/plain');
    next(); //continue to look for additional specifications down below. the updated req, and response will be passed to next
})
.get( (req,res,next) => {
    res.end("Will send details of the dish: " + req.params.dishId +' to you.')
})
.post((req,res,next) => {
    res.statusCode = 403 //HTTP code for not supported
    res.end('Post operation not supported on /dishes/'+ req.params.dishId);
})
.put( (req,res,next) => {
    res.write('Updating the dish: '+req.params.dishId + '\n');
    res.end('Will update the dish: '+ req.body.name + ' with details: '+ req.body.description);
})
.delete((req,res,next) => {
    res.end("Deleting the dish: " + req.params.dishId);
});

module.exports = dishRouter;
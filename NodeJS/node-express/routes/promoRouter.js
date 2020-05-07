const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode= 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req,res,next) => {
    res.end("Will send you details for all promos");
})
.post((req, res, next) => {
    res.end('Will add the promo: '+req.body.name+ ' with detail: '+req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not support by /promos");
})
.delete((req,res,next) => {
    res.end("Will delete all the promos");
})

//individual promos
promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get( (req,res,next) => {
    res.end("Will send details of the promo: " + req.params.promoId +' to you.')
})
.post((req,res,next) => {
    res.statusCode = 403
    res.end('Post operation not supported on /promos/'+ req.params.promoId);
})
.put( (req,res,next) => {
    res.write('Updating the promo: '+req.params.promoId + '\n');
    res.end('Will update the promo: '+ req.body.name + ' with details: '+ req.body.description);
})
.delete((req,res,next) => {
    res.end("Deleting the promo: " + req.params.promoId);
});

module.exports = promoRouter;
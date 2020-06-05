const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

//include schema to refer to the promos in the mongodb
const Promotions = require('../models/promotions');
const cors = require('./cors');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors,(req,res,next) => {
    Promotions.find(req.query)  //query conditions added to req by express as json
    .then((promos) => {
        res.statusCode= 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err))
    })
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log("Promo create", promo.toJSON());
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not support by /promos");
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    Promotions.remove({})
    .then((resp) => {
        console.log("All promos deleted");
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err))
});

//individual promos
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors,(req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end('Post operation not supported on /promos/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {new: true})
    .then((promo) => {
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    Promotions.findByIdAndDelete(req.params.promoId) //diff b/w ..delete and remove?
    .then((promo) => {
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = promoRouter;
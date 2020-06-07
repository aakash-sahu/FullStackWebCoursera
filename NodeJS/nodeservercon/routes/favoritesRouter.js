//Router for favorite dishes
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user:req.user._id}) //need to include 'if' if user not found
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        console.log('Finding favs for user: '+req.user._id ) 
        if (favs != null) {
            console.log('Get favs: ',favs.dish);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favs); // alternate if not using if else statements res.json((favs==null) ? []:favs.dish);
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'plain/text');
            res.end("No favorite dishes addded");
        }
    }, (err) => next(err))
    .catch((err)=>next(err))
})
//currently not checking if dish is even a valid dish present in the dishes DB. 
//Probably not needed when using along with UI but if building only API, should have that fucntionality
//post will contain a list of dish ids like -- [{"_id": "5edbcced945f724f18b666d2"}] ..in original code it was {"dish": [{"_id":"5ed423a25e743e3644f03a6c"},{"_id":"5ed424cb0fc2f24598569a48"},{"_id":"5ed424cb0fc2f24598569a49"}]}
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user:req.user._id})  
    .then((favs) => {
        if (favs == null) {
            req.body.user = req.user._id;   //    alternate from other -Favorites.create({user:req.user._id, dishes:req.body})
            console.log('Adding favs: ',{user:req.user._id, dishes:req.body}.toJSON());
            Favorites.create({user:req.user._id, dishes:req.body})
            .then((favs) => {
                Favorites.findOne({user:req.user._id})
                .populate('user')
                .populate('dishes')
                .then((favs) => {
                    console.log(favs)
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favs);
                }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err))
        }
        else {
            // can try addtoSet method instead of 'for' loop like the pull method is delete by dishID
            //https://mongoosejs.com/docs/api.html#mongoosearray_MongooseArray-addToSet
            for(var i = 0; i<= req.body.length -1;i++){ //modified as sending array in request
                if (favs.dishes.indexOf(req.body[i]._id) <0)
                    favs.dishes.push(req.body[i]);
                // else 
                //     favs.dish.push(req.body[i]);
            }
            favs.save()
            .then((favs) => {
                // Favorites.findOne({user:favs.user._id})
                Favorites.findById(favs._id)    //since just created we can search by Id
                .populate('user')
                .populate('dishes')
                .then((updatedFav) => {
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(updatedFav);
                }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    })
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode= 403;
    res.end('PUT operation not supported on /favorites/');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorites.deleteOne({user:req.user._id})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp); 
    }, (err)=> next(err))
    .catch( (err) => next(err))
});

//router for /:dishId
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //check if dish is already favorite of user
    Favorites.findOne({user:req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //if dish not part of favs,set flag exists false
            return res.json({"exists":false, "favorites":favorites})
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                //favorites exists but dish dont' exist in favorites
                return res.json({"exists":false, "favorites":favorites})
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                //favorites exists but dish dont' exist in favorites
                return res.json({"exists":true, "favorites":favorites})
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
    // res.statusCode= 403;
    // res.setHeader('Content-Type', 'text/plain');
    // res.end('GET operation not supported on /favorites/'+req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user:req.user._id})  
    .then((favs) => {
        if (favs.dishes.indexOf(req.params.dishId) >=0) {
            res.statusCode=200;
            res.end("Dish already present in favorites");
        }
        else {
            favs.dishes.push(req.params.dishId);
            }
            favs.save()
            .then((favs) => {
                // Favorites.findOne({user:favs.user._id})
                Favorites.findById(favs._id)
                .populate('user')
                .populate('dishes')
                .then((updatedFav) => {
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(updatedFav)
                })
            }, (err) => next(err))
            .catch((err) => next(err))
    })    
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode= 403;
    res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favs) =>{
        if (favs == null){
            err = new Error('No favorites found for user: '+req.user._id);
            err.status = 404;
            return next(err); 
        }
        else {
            favs.dishes.pull(req.params.dishId); //deleting the dish using dish id.
            favs.save()
            .then((favs) => {
                // Favorites.findOne({user:req.user._id}) 
                Favorites.findById(favs._id)    //can find by id also
                .populate('user')
                .populate('dishes')
                .then((favs) => {
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favs)
                })
            }, (err) => next(err))
        }
    })
    .catch( (err) => next(err))
});

module.exports = favoriteRouter;
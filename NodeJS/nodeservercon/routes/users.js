var express = require('express');
const bodyParser = require('body-parser');

var User = require('../models/users');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//set up routers beyond the /users link.. post method as user will be sending information
router.post('/signup', (req, res, next) => {
  //expected that username and password will be part of body in user request
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null) {
      var err = new Error('User '+req.body.username+ ' already exists');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((user) => {
    res.statusCode= 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration successful!', user:user});
  }, (err) => next(err));
});

//in login reuse the auth function used in authorization
router.post('/login', (req, res, next) => {

  //if user hasn't authenticated yet, expect user to authenticate first
  if(!req.session.user) {
    var authHeader = req.headers.authorization;  //challenge client to provide authetication
    
    if(!authHeader){
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic'); //had typo here. that's why browser auth window was not popping up
      err.status = 401; //401 is HTTP not authenticated status code
      return next(err);  
    }
    //get username and password from header
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')  //Buffer converts strings into streams of binary data, then split to get the base 64encoded username and pwd
    //last split on ':' because after decoding format is username:password
    var username = auth[0];
    var password = auth[1];
    
    //find the user in the database
    User.findOne({username: username})
    .then((user)=> {
      if (user === null) {
        var err = new Error('User '+ username+ ' does not exist!');
        err.status = 403; 
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect');
        err.status = 403; 
        return next(err);
      }
      else if (user.username ===username && user.password === password) {
        req.session.user = 'authenticated'; //set session's user to authenticated
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated');
      } 
    })
    .catch((err) => next(err))
  }
  //else part for the situation when req.session.user is set
  else {
    res.statusCode= 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!')
  }
});

//log out is get as no information is being sent by user on logout
router.get('/logout', (req,res) => {
  if (req.session) {
    req.session.destroy(); //info is removed from server side by destroy method available in session
    res.clearCookie('session-id'); //ask client to delete the cookie named session-id
    res.redirect('/'); //redirect user to homepage
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;

var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate')
const cors = require('./cors');

var User = require('../models/users');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => {res.sendStatus(200);} ) //add CORS for all requests if client sends options first
//cors with options in get also as this is done only by admin
router.get('/',cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode=200;
    res.setHeader("Content-Type", "application/json");
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err))
});

//set up routers beyond the /users link.. post method as user will be sending information
router.post('/signup',cors.corsWithOptions,  (req, res, next) => {
  //expected that username and password will be part of body in user request
  //PLM provides a register method
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        //after registration, authenticate the same user using passport
        if (req.body.firstname)   //setting fname and lastname here to let user setup be done without error first
          user.firstname = req.body.firstname;
        if (req.body.lastname)   
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }
            passport.authenticate('local')(req, res, () => {
              res.statusCode= 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status:'Registration successful!', username: user.username })
        });
        });
      }
    });
  });

//with passport username and pwd expected to be part of body, not authorization header
//if error in authenticate, passport will take care of sending error msg to client. so next not needed
//doing passport authenticate adds a user property to the req msg i.e. req.user. then passport will serialize user and save in session
// local strategy on first attempt, then issue token, and then use JWT.
router.post('/login',cors.corsWithOptions,  (req, res, next) => {

  // updating authenticate as earlier this only returns unauthorized as response if user can't login
  //now adding additional functionality to auth 
  //below auth locl return err, user (if user can log in or not), and info (additional info about why user can't log in)
  passport.authenticate('local',(err, user, info) => {
    if (err)
    return next(err);

    //if user doesn't exist, or pwd is incorrect. that info will be encoded in 'info' object
    if (!user) { 
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err:info}); 
    }
    // if reached this point, that mean no error plus user also found. so user can be logged in
    // passport add method logIn to req
    req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err:'Could not log in user!'});   
        }

        var token = authenticate.getToken({_id: req.user._id}); //create token. include only user ID from user's info
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Login Successful!', token: token});   
    });
    }) (req, res, next);
});

//log out is get as no information is being sent by user on logout
router.get('/logout',cors.corsWithOptions,  (req,res, next) => {
  //following changes because of error in the output -- stil getting error even though everything is running.. will figure out later.
  if (req.user) {
    req.session.destroy(); //info is removed from server side by destroy method available in session
    res.clearCookie('session-id'); //ask client to delete the cookie named session-id
    req.logout()
    res.redirect('/'); //redirect user to homepage
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

//to authenticate users using facebook oauth and create/return the JSON web token
//passport authenticate sends authentication to facebook
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) { //if user if authenticated via fac
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode= 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'}); //send token back to client
  }
});

//add router to check token periodically.Returns true or false if token is still valid
router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
    return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }

    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT Valid!', success: true, user: user});
    }
  }) (req, res);
})


module.exports = router;

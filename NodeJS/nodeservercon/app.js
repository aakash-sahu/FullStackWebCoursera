var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//add new routes here
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

//code to integrate the API with the database
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to the mongodb server");
}, (err) => {console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//adding basic authentication here so only authenticated user can more past this in the app
//basic http authentication 
//first add auth function
function auth (req, res, next) {
  console.log(req.headers);
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
  var user = auth[0];
  var pass = auth[1];
  if (user==='admin' && pass=== 'password'){
    next(); //authenticated
  } else {
    var err = new Error('You are not authenticated');
    res.setHeader('WWW-Authenticate', 'Basic'); 
    err.status = 401; 
    next(err);
  }
}

app.use(auth); //open in incognito browser to check -- username/password window not popping up in chrome..only working in postman--resolved.had typo

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//add app.use routes
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

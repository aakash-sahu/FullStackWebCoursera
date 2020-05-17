var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

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
// comment out cookie partser to use sessions
// app.use(cookieParser('12345-67890-09876-54321')); //set up a secret key to setup a signed cookie. key to encrypt and sign the cookie send from server

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

//passport
app.use(passport.initialize()); 
app.use(passport.session()); //session adds user to the session and the cookie

//moved up after setting up users routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

//updating to use session
//adding basic authentication here so only authenticated user can more past this in the app
//basic http authentication 
//first add auth function
function auth (req, res, next) {
  console.log(req.session); //using session adds session to request

  if(!req.user) {
    var err = new Error('You are not authenticated');
    err.status = 401; 
    next(err);
    }
  else {
      next();
    }
}

app.use(auth); //open in incognito browser to check -- username/password window not popping up in chrome..only working in postman--resolved.had typo

app.use(express.static(path.join(__dirname, 'public')));

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

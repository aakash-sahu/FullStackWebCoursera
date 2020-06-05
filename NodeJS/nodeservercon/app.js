var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//add new routes here
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoritesRouter');
var commentRouter = require('./routes/commentRouter');

//code to integrate the API with the database
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to the mongodb server");
}, (err) => {console.log(err); });

var app = express();

//redirect all requests to https
app.all('*', (req,res,next) => {
  if (req.secure) { //if request already on secure port
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' +app.get('secPort') + req.url);
    //307 means --?? user should not change the method
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// comment out cookie partser to use sessions
// app.use(cookieParser('12345-67890-09876-54321')); //set up a secret key to setup a signed cookie. key to encrypt and sign the cookie send from server

//passport
app.use(passport.initialize()); 

//moved up after setting up users routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

///leave public folder open for jwt
app.use(express.static(path.join(__dirname, 'public')));

//add app.use routes
//letting get request open for all users
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);

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

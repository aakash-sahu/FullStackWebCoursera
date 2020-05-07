const express = require('express');
const http = require('http');
const morgan = require('morgan'); //for logging
const bodyParser = require('body-parser'); //middleware for parsing json

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = '3000';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

//mount the router at end-point
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

//server static files --order matter- put after API
app.use(express.static(__dirname+ '/public'));  //setup server to serve html files from public folder; static tells server to serve static files from dir

//function to setup server //next is use to invoke additional middleware to take care of work on your behalf
app.use((req, res, next) => {
    res.statusCode= 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express server</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

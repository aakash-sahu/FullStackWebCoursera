const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin:true}; //allow request to be accepted as Origin contains origin from whitelist
    }
    else {
        corsOptions = {origin:false};   //otherwise don't allow the request
    }
    callback(null, corsOptions);
};

exports.cors = cors(); //for get ops return Access-Control-Allow-Origin: *
exports.corsWithOptions = cors(corsOptionsDelegate);
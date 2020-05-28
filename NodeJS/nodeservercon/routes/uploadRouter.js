// Router to upload images
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

//storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/images' ); //1st params is error, 2nd parameters is destination folder
    },
filename: (req, file, cb) => {
    cb(null, file.originalname);
    }
});

//restricting file types
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false)
    }
    cb(null, true);
};

const upload = multer({storage: storage, fileFilter :imageFileFilter})

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not support by /imageUpload");
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, 
    upload.single('imageFile'), (req, res) => { //'imagefile' is the key required in API call to server
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not support by /imageUpload");
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation not support by /imageUpload");
})

module.exports = uploadRouter;
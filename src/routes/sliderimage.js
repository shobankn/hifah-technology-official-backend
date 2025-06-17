const express = require('express');
const {uploadtoS3, upload} = require('../utils/uploadtos3');
const {uploadSliderimages} = require('../controllers/hifah-slider');
const sliderimagerouter = express.Router();

// sliderimagerouter.route('/slider-image').post(upload.array('images', 50),uploadSliderimages);
sliderimagerouter.post('/upload-slider', upload.array('images',50), uploadSliderimages);

module.exports = sliderimagerouter;


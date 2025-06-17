const express = require('express');
const { createservice, updateservice, deleteservice, getAllService, getsingleservice } = require('../controllers/serviceController');
const { upload } = require('../middleware/Cloudupload');
const authentication = require('../middleware/authentication');
const serviceroute = express.Router();


serviceroute.route('/create-service').post(upload.fields([{ name: 'icon' }, { name: 'thumbnail' }]),authentication,createservice);
serviceroute.route('/update-service/:id').put(upload.fields([{ name: 'icon' }, { name: 'thumbnail' }]),authentication,updateservice);
serviceroute.route('/delete-service/:id').delete(authentication,deleteservice);
serviceroute.route('/get-all-service').get(getAllService);
serviceroute.route('/get-service-detail/:id').get(getsingleservice);

module.exports = serviceroute
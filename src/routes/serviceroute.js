const express = require('express');
const { createservice, updateservice, deleteservice, getAllService, getsingleservice } = require('../controllers/serviceController');
const { upload } = require('../middleware/Cloudupload');
const authentication = require('../middleware/authentication');
const serviceroute = express.Router();


serviceroute.route('/create-service').post(upload.fields([
    
    { name: 'icon', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'exploreIcons', maxCount: 10 }
  ]),authentication,createservice);

serviceroute.route('/update-service/:id').put( upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'exploreIcons',maxCount: 10 } // allow multiple explore icons
  ]),authentication,updateservice);
serviceroute.route('/delete-service/:id').delete(authentication,deleteservice);
serviceroute.route('/get-all-service').get(getAllService);
serviceroute.route('/get-service-detail/:id').get(getsingleservice);

module.exports = serviceroute
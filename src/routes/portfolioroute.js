const express = require('express');
const { addPortfolio, updatePortfolio, deletePortfolio, getSinglePortfolio, getAllPortfolios } = require('../controllers/portfoliocontroller');
const { upload } = require('../middleware/Cloudupload');
const authentication = require('../middleware/authentication');
const portfolioRoute = express.Router();

const uploadFields = [
  { name: 'image', maxCount: 1 },
  ...Array.from({ length: 10 }, (_, i) => ({ name: `paragraphImage-${i}`, maxCount: 1 }))
];


portfolioRoute.route('/post-portfolio').post( upload.fields(uploadFields),authentication,addPortfolio);
portfolioRoute.route('/update-portfolio/:id').put(upload.fields(uploadFields),authentication,updatePortfolio);
portfolioRoute.route('/delete-portfolio/:id').delete(authentication,deletePortfolio);
portfolioRoute.route('/get-all-portfolio').get(getAllPortfolios);
portfolioRoute.route('/get-single-portfolio/:id').get(getSinglePortfolio);

module.exports = portfolioRoute;
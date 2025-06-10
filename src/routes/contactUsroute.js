// contactUsroute.js
const express = require('express');
const { submitContactForm } = require('../controllers/contactus');

const contactRouter = express.Router();

contactRouter.route('/contact-us').post(submitContactForm);

module.exports = contactRouter;

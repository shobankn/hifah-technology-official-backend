const express = require('express');
const { AdminSignup, AdminSignin, AdminSignout } = require('../controllers/authcontroller');
const authentication = require('../middleware/authentication');
const { subscribeUser } = require('../controllers/subscriptioncontroller');
const adminroute = express.Router();

adminroute.route('/signup').post(AdminSignup);
adminroute.route('/signin').post(AdminSignin);
adminroute.route('/signout').post(AdminSignout);
adminroute.route('/subscribe').post(subscribeUser);

module.exports = adminroute


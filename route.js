"use strict";

var router = require('express').Router();
var flightController = require('./controllers/flightController');
var bookingController = require('./controllers/bookingController');
var passengerController = require('./controllers/passengerController');
var flightDetailController = require('./controllers/flightDetailController');
var userController = require('./controllers/userController');
var authController = require('./controllers/authController');
var clientController = require('./controllers/clientController');
var oauth2Controller = require('./controllers/oauth2Controller');


router.route('/api/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers);

// Create endpoint handlers for /clients
router.route('/api/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

router.route('/api/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/api/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token);

router.route('/api/all-flights')
	.get(authController.isAuthenticated,flightController.getAllFlights);

router.route('/api/flights')
	.get(flightController.getFlights)
	.post(authController.isAuthenticated,flightController.addFlight)
	.put(authController.isAuthenticated,flightController.updateFlight);

router.route('/api/passengers')
    .get(authController.isAuthenticated,passengerController.getAllPassengers);

router.route('/api/flight-details')
    .get(authController.isAuthenticated,flightDetailController.getAllFlightDetails);

router.route('/api/booking')
    .post(bookingController.booking)
    .get(authController.isAuthenticated, bookingController.getAll);
    
router.post('/api/booking/completed', bookingController.completedBooking);
router.get('/api/booking/:id', bookingController.getBooking);
router.put('/api/booking/:id', bookingController.updateBooking);
router.delete('/api/booking/:id', bookingController.deleteBooking);

module.exports = router;

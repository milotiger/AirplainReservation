"use strict";

var route = require('express').Router();
var flightController = require('./controllers/flightController');
var bookingController = require('./controllers/bookingController');
var passengerController = require('./controllers/passengerController');
var flightDetailController = require('./controllers/flightDetailController');

route.get('/api/all-flights',flightController.getAllFlights);
route.get('/api/flights' , flightController.getFlights);
route.post('/api/flights', flightController.addFlight);

route.get('/api/passengers', passengerController.getAllPassengers);

route.get('/api/flight-details', flightDetailController.getAllFlightDetails);

route.post('/api/booking' , bookingController.booking);
route.get('/api/booking', bookingController.getAll);
route.post('/api/booking/completed' , bookingController.completedBooking);
route.get('/api/booking/:id' , bookingController.getBooking);
route.put('/api/booking/:id' , bookingController.updateBooking);
route.delete('/api/booking/:id' , bookingController.deleteBooking);

module.exports = route;
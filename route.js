"use strict";

let route = require('express').Router();
let flightController = require('./controllers/flightController');
let bookingController = require('./controllers/bookingController');

route.get('/api/flights' , flightController.getFlights);
route.post('/api/booking' , bookingController.booking);
route.post('/api/booking/completed' , bookingController.completedBooking);
route.get('/api/booking/:id' , bookingController.getBooking);
route.put('/api/booking/:id' , bookingController.updateBooking);
route.delete('/api/booking/:id' , bookingController.deleteBooking);

module.exports = route;
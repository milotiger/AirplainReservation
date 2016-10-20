"use strict";

let route = require('express').Router();
let flightController = require('./controllers/flightController');

route.get('/api/flights' , flightController.getFlights);
route.post('/api/booking' , flightController.booking);
route.post('/api/booking/completed' , flightController.completedBooking);

module.exports = route;
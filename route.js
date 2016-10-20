"use strict";

let route = require('express').Router();
let flightController = require('./controllers/flightController');

route.get('/api/flights' , flightController.getFlights);

module.exports = route;
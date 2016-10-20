"use strict";

let flights = require('../models/flights');

let flightController = {
	getFlights : function (req, res) {
		if(Object.keys(req.query).length === 0) {
			flights.find({}).distinct('NOIDI', function(err, flight) {
				if(!err) {
					res.status(200).json(flight);
				}
			})	
		}
		else {
			if( Object.keys(req.query).length === 1 ) { // ...url?start=''
				flights.find({NOIDI : req.query.start}).distinct('NOIDEN', function(err, flight) {
					if(!err) {
						res.status(200).json(flight);
					}
				})
			}
		}
	}
}

module.exports = flightController;

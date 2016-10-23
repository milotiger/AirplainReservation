"use strict";

let flights = require('../models/flights');

let flightController = {
    getFlights: function(req, res) {
        if (Object.keys(req.query).length === 0) {
            flights.find({}).distinct('NOIDI', function(err, flight) {
                if (!err) {
                    res.status(200).json(flight);
                } else {
                    res.status(400).json({ "error": true, "messages": "Flight Not Found" });
                }
            })
        } else {
            if (Object.keys(req.query).length === 1) { // ...url?start=''
                flights.find({ NOIDI: req.query.start }).distinct('NOIDEN', function(err, flight) {
                    if (!err && flight.length !== 0) {
                        res.status(200).json(flight);
                    } else {
                        res.status(400).json({ "error": true, "messages": "Flight Not Found" });
                    }
                })
            } else if (Object.keys(req.query).length === 2) { //...url?start=''&date=''
                flights.find({ NOIDI: req.query.start, NGAY: req.query.date }, function(err, flights) {
                    if (!err && flights.length !== 0) {
                        res.status(200).json(flights);
                    } else {
                        res.status(400).json({ "error": true, "messages": "Flight Not Found" });
                    }
                })
            } else if (Object.keys(req.query).length === 3) { //....url?date=''&passengers=''&rate=''
                flights.find({ NGAY: req.query.date, HANG: req.query.rate }).where('SOLUONGGHE').gt(req.query.passengers).exec(
                    function(err, flights) {
                        if (!err && flights.length !== 0) {
                            res.status(200).json(flights);
                        } else {
                            res.status(400).json({ "error": true, "messages": "Flight Not Found" });
                        }
                    });
            }
        }
    },
}

module.exports = flightController;

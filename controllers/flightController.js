"use strict";

var flights = require('../models/flights');

var flightController = {
    getAllFlights : function( req, res ) {
        flights.find({}, '-_id', function( err, allflights ) {
            if( err ) res.status(400).json({'error' : true, 'messages' : 'Cant load all flights'});
            else res.status(200).json(allflights);
        })
    },

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
            } else if (Object.keys(req.query).length === 5) { //....url?start=''&end=''&date=''&passengers=''&rate=''
                flights.find({ NOIDI : req.query.start, NOIDEN : req.query.end, NGAY: req.query.date, HANG: req.query.rate }).where('SOLUONGGHE').gt(req.query.passengers).exec(
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

    addFlight : function( req , res ) {
        let flight = new flights({
            'MA' : req.body.MA,
            'NOIDI' : req.body.NOIDI,
            'NOIDEN' : req.body.NOIDEN,
            'NGAY' : req.body.NGAY,
            'GIO' : req.body.GIO,
            'HANG' : req.body.HANG,
            'MUCGIA' : req.body.MUCGIA,
            'SOLUONGGHE' : req.body.SOLUONGGHE,
            'GIABAN' : req.body.GIABAN
        });

        flight.save(function ( err ) {
            if( !err ) res.status(200).json({'error' : false, 'messages' : 'completed'});
            else res.status(400).json({'error' : true});
        })
    }
};

module.exports = flightController;

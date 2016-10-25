"use strict";

var flightDetails = require('../models/flightDetails');

var flightDetailController = {
    getAllFlightDetails : function( req, res ) {
        flightDetails.find({}, '-_id', function( err, alldetails ) {
            if( err ) res.status(400).json({'error' : true, 'messages' : 'Cant load all flight details'});
            else res.status(200).json(alldetails);
        })
    }
};

module.exports = flightDetailController;

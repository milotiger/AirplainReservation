"use strict";

var passengers = require('../models/passengers');

var passengerController = {
    getAllPassengers : function( req, res ) {
        passengers.find({}, '-_id', function( err, allpassengers ) {
            if( err ) res.status(400).json({'error' : true, 'messages' : 'Cant load all passengers'});
            else res.status(200).json(allpassengers);
        })
    }
};

module.exports = passengerController;

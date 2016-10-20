var mongoose = require('mongoose');

var passengerSchema = new mongoose.Schema({
	MADATCHO : { type : String, ref : 'Booking' },
	DANHXUNG : String,
	HO 		 : String,
	TEN 	 : String
});

var passengers = mongoose.model('Passengers',passengerSchema,'Passengers');

module.exports = passengers;
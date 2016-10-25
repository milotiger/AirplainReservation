var mongoose = require('mongoose');

var flightDetailSchema = mongoose.Schema({
		MADATCHO : { type : String, ref : 'Booking' },
		MACHUYENBAY : { type : String, ref : 'Flights' },
		NGAY : String,
		GIO : { type : String, ref : 'Flights' },
		HANG : { type : String, ref : 'Flights' },
		MUCGIA : { type : String, ref : 'Flights' },
});

var flightDetail = mongoose.model('FlightDetails',flightDetailSchema,'FlightDetails');

module.exports = flightDetail;
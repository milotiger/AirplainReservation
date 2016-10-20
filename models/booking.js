var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
		MA : String,
		THOIGIANDATCHO : String,
		TONGTIEN : Number,
		TRANGTHAI : Number
});

var booking = mongoose.model('Booking',bookingSchema,'Booking');

module.exports = booking;
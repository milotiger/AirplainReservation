"use strict";

let mongoose = require('mongoose');

let flightSchema = new mongoose.Schema({
	MA 			: String,
	NOIDI 		: String,
	NOIDEN 		: String,
	NGAY 		: String,
	GIO 		: String,
	HANG 		: String,
	MUCGIA 		: String,
	SOLUONGGHE 	: Number,
	GIABAN 		: Number
});

let flightModel = mongoose.model('Flights',flightSchema,'Flights');

module.exports = flightModel;
"use strict";

let flights = require('../models/flights');
let helper = require('../helper');
let passengers = require('../models/passengers');
let booking = require('../models/booking');
let flightDetails = require('../models/flightDetails');

let flightController = {
	getFlights : function (req, res) {
		if(Object.keys(req.query).length === 0) {
			flights.find({}).distinct('NOIDI', function(err, flight) {
				if(!err) {
					res.status(200).json(flight);
				}
				else {
					res.status(400).json({"error" : true , "messages" : "Flight Not Found"});
				}
			})	
		}
		else {
			if( Object.keys(req.query).length === 1 ) { // ...url?start=''
				flights.find({NOIDI : req.query.start}).distinct('NOIDEN', function(err, flight) {
					if(!err && flight.length !== 0) {
						res.status(200).json(flight);
					}
					else {
						res.status(400).json({"error" : true , "messages" : "Flight Not Found"});
					}
				})
			}
			else if( Object.keys(req.query).length === 2 ) { //...url?start=''&date=''
				flights.find({ NOIDI : req.query.start, NGAY : req.query.date} , function(err, flights) {
					if(!err && flights.length !== 0) {
						res.status(200).json(flights);
					}
					else {
						res.status(400).json({"error" : true , "messages" : "Flight Not Found"});
					}
				})
			}
			else if( Object.keys(req.query).length === 3 ) { //....url?date=''&passengers=''&rate=''
				flights.find({ NGAY : req.query.date, HANG : req.query.rate }).where('SOLUONGGHE').gt(req.query.passengers).exec(
				function (err, flights) {
					if (!err && flights.length !== 0) {
						res.status(200).json(flights);
					}
					else {
						res.status(400).json({"error" : true , "messages" : "Flight Not Found"});
					}
				});
			}
		}
	},

	booking : function (req, res) {
		let MADATCHO = helper.randomstring(6);
		let HANHKHACH = req.body.HANHKHACH;

		//Lưu hành khách vào bảng hành khách
		for(let i = 0; i < HANHKHACH.length; i++) {
			HANHKHACH[i].MADATCHO = MADATCHO;
			let passenger = new passengers( HANHKHACH[i] );
			passenger.save( function( err ){
				// Response sẽ có lỗi do hàm save là hàm async chạy trong vòng for nó sẽ send header nhiều lần
				// Để về anh fix
				// if( err ) {
				// 	res.status(400).json({'error' : true, 'messages' : 'Cant save this passenger!'});
				// }
				// else {
				// 	res.status(200).json({'error' : false});
				// }
			});
		}
		
		//Tạo đặt chỗ mới
		let newBooking = new booking({
			MA : MADATCHO,
			THOIGIANDATCHO : helper.getTimeBooking(),
			TONGTIEN : 0,
			TRANGTHAI : 0
		});

		newBooking.save( function( err ) {
			// if( err ) {
			// 	res.status(400).json({'error' : true, 'messages' : 'Cant create new booking!'});
			// }
			// else {
			// 	res.status(200).json({'error' : false});
			// }
		});

		//Trả về mã đặt chỗ
		res.status(200).json({
			MADATCHO  : MADATCHO,
		});
	},

	completedBooking : function( req, res ) {

		let Information = req.body.CHUYENBAY;

		for(let i = 0; i < Information.length; i++) {
			let FlightDetail = new flightDetails({
				MADATCHO : req.body.MADATCHO,
				MACHUYENBAY : Information[i].MACHUYENBAY,
				NGAY : Information[i].NGAY,
				HANG : Information[i].HANG,
				MUCGIA : Information[i].MUCGIA
			});

			FlightDetail.save( function (err) {
				// Response sẽ có lỗi do hàm save là hàm async chạy trong vòng for nó sẽ send header nhiều lần
				// Để về anh fix
				// if( err ) {
				// 	res.		status(400).json({'error' : true, 'messages' : 'Cant create new FlightDetail!'});
				// }

				// else {
				// 	res.status(200).json({'error' : false});
				// }
			});
		}
	}
}

module.exports = flightController;

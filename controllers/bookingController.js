"use strict";

let flights = require('../models/flights');
let helper = require('../helper');
let passengers = require('../models/passengers');
let booking = require('../models/booking');
let flightDetails = require('../models/flightDetails');

let bookingController = {
	booking: function(req, res) {
		let error = false;
		let MADATCHO = helper.randomstring(6);
        let HANHKHACH = helper.getPassengers(req.body.HANHKHACH); // Để lưu MADATCHO đúng thứ tự col trong db

        //Lưu hành khách vào bảng hành khách
        for (let i = 0; i < HANHKHACH.length; i++) {
        	HANHKHACH[i].MADATCHO = MADATCHO;
        	let passenger = new passengers(HANHKHACH[i]);
        	passenger.save(function(err) {
        		if (err) {
        			error = true;
        		}
        	});
        }

        //Tạo đặt chỗ mới
        let newBooking = new booking({
        	MA: MADATCHO,
        	THOIGIANDATCHO: helper.getTimeBooking(),
        	TONGTIEN: 0,
        	TRANGTHAI: 0
        });

        newBooking.save(function(err) {
        	if (err) {
        		error = true;
        	}
        });

        if (!error) {
            //Trả về mã đặt chỗ
            res.status(200).json({
            	MADATCHO: MADATCHO,
            });
        } else {
        	res.status(400).json({ 'error': true, 'messages': 'Something went wrong' });
        }
    },

    completedBooking: function(req, res) {
    	let error = false;
    	let Information = req.body.CHUYENBAY;
    	let totalPaid = 0;

        //wait for all async callback completed for using the variable totalPaid
        let promises = Information.map(function(item) {
        	return new Promise(function(resolve, reject) {
        		let FlightDetail = new flightDetails({
        			MADATCHO: req.body.MADATCHO,
        			MACHUYENBAY: item.MACHUYENBAY,
        			NGAY: item.NGAY,
        			HANG: item.HANG,
        			MUCGIA: item.MUCGIA
        		});

        		FlightDetail.save(function(err) {
        			if (!err) {
        				flights.find({ 'MA': FlightDetail.MACHUYENBAY, 'HANG': FlightDetail.HANG, 'MUCGIA': FlightDetail.MUCGIA }, function(err, flight) {
        					if (!err) {
        						passengers.find({ 'MADATCHO': FlightDetail.MADATCHO }).count(function(err, count) {
        							if (!err) {
        								flight[0].SOLUONGGHE -= count;
        								flight[0].save(function( err ) {
        									if( err ) error = true;
        								});
        								totalPaid += count * flight[0].GIABAN;
        								resolve();
        							}
        						})
        					}
        				})
        			} else
        			error = true;
        		});
        	})
        })

        Promise.all(promises)
        .then(function() {
        	if (!error) {
        		booking.findOneAndUpdate({ 'MA': req.body.MADATCHO }, { 'TONGTIEN': totalPaid, 'TRANGTHAI': 1 }, function(err, result) {
        			if (!err) {
        				res.status(200).json({ 'error': false, 'messages': 'Completed Booking' });
        			}
        		})

        	} else
        	res.status(400).json({ 'error': true, 'messages': 'Something went wrong' });
        })
        .catch(console.error);
    },

    getBooking : function( req, res ) {
    	let err = false;
    	booking.findOne({ 'MA' : req.params.id }, '-_id -__v', function( err, resultBooking ) {
    		if( err ) err = true;
    		else {
    			let bookingInfo = {};
    			bookingInfo.THONGTINDATCHO = resultBooking;
    			passengers.find({ 'MADATCHO' : resultBooking.MA }, '-_id -__v -MADATCHO', function( err, resultPassengers ) {
    				if( err ) err = true;
    				else {
    					bookingInfo.HANHKHACH = resultPassengers;
    					flightDetails.find({ 'MADATCHO' : resultBooking.MA }, '-_id -__v -MADATCHO', function( err, flightDetails ) {
    						if ( err ) err = true;
    						else {
    							bookingInfo.CHANGBAY = flightDetails;
    							if ( err ) res.status(400).json({ 'error' : true });
    							else res.status(200).json(bookingInfo);
    						}
    					})
    				}
    			})
    		}
    	})    	
    },

    updateBooking : function( req, res ) {

    	let error = false;
    	let Information = req.body.CHUYENBAY;
    	let Passengers = helper.getPassengers(req.body.HANHKHACH);
    	let totalPaid = 0;

    	let promise = new Promise(function( resolve, reject ) {
    		//update new passengers
    		passengers.remove({ 'MADATCHO' : req.params.id }, function( err, removed ) {
    			if( err ) error = true;
    			else {
    				flightDetails.find({ 'MADATCHO' : req.params.id }, '-_id -__v -MADATCHO -NGAY' , function( err, result ) {
    					if( err ) error = true;
    					else {
    						for (let i = 0; i < result.length; i++) {
    							flights.findOne({ 'MA' : result[i].MACHUYENBAY, 'HANG' : result[i].HANG, 'MUCGIA' : result[i].MUCGIA }, function( err, flight ) {
    								if( err ) error = true;
    								else {
    									flight.SOLUONGGHE += removed.result.n;
    									flight.save(function( err ) {
    										if( err ) error = true;
    									})
    								}
    							})
    						}
    					}
    				});

    				for (let i = 0; i < Passengers.length; i++) {
    					Passengers[i].MADATCHO = req.params.id;
    					let passenger = new passengers(Passengers[i]);
    					passenger.save(function(err) {
    						if (err) error = true;
    						resolve();
    					});
    				}
    			}
    		});
    	})

    	//Cần sử dụng promise để xử lý bất đồng bộ
        // //wait for all async callback completed for using the variable totalPaid
        promise.then(function() {
        	flightDetails.remove({ 'MADATCHO' : req.params.id}, function( err, removed ) {
        		if( err ) error = true;
        		else {
        			let promises = Information.map(function(item) {
        				return new Promise(function(resolve, reject) {
        					let FlightDetail = new flightDetails({
        						MADATCHO: req.params.id,
        						MACHUYENBAY: item.MACHUYENBAY,
        						NGAY: item.NGAY,
        						HANG: item.HANG,
        						MUCGIA: item.MUCGIA
        					});

        					FlightDetail.save(function(err) {
        						if (!err) {
        							flights.find({ 'MA': FlightDetail.MACHUYENBAY, 'HANG': FlightDetail.HANG, 'MUCGIA': FlightDetail.MUCGIA }, function(err, flight) {
        								if (!err) {
        									passengers.find({ 'MADATCHO': FlightDetail.MADATCHO }).count(function(err, count) {
        										if (!err) {
        											flight[0].SOLUONGGHE -= count;
        											flight[0].save(function( err ) {
        												if( err ) error = true;
        											});
        											totalPaid += count * flight[0].GIABAN;
        											resolve();
        										}
        									})
        								}
        							})
        						}
        						else error = true;
        					});
        				})
        			})

        			Promise.all(promises)
        			.then(function() {
        				if (!error) {
        					booking.findOneAndUpdate({ 'MA': req.params.id }, { 'TONGTIEN': totalPaid, 'TRANGTHAI': 1 }, function(err, result) {
        						if (!err) {
        							res.status(200).json({ 'error': false, 'messages': 'Completed Booking' });
        						}
        					})

        				} else
        				res.status(400).json({ 'error': true, 'messages': 'Something went wrong' });
        			})
        			.catch(console.error);
        		}
        	})
        })
        .catch(console.error);
    },

    deleteBooking : function( req, res ) {
    	res.status(200).json('Hello');
    }
}

module.exports = bookingController;
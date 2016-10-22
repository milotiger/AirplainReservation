"use strict";

let helper = {
	randomstring : function( Length ){
	    let s = '';
	    let randomchar = function(){
	    	let n = Math.floor( Math.random() * 35 );
	    	if( n < 10 ) return n; //1-10
	    	if( n < 36 ) return String.fromCharCode( n + 55 ); //A-Z
	    }
	    while( s.length < Length )
	    	s+= randomchar();
	    return s;
	},

	getPassengers : function( HANHKHACH ){
		let Passengers = [];
		for(let i = 0; i < HANHKHACH.length; i++) {
			let data = {
				MADATCHO : "", // Khởi tạo rỗng mã đặt chỗ
				DANHXUNG : HANHKHACH[i].DANHXUNG,
				HO 	   	 : HANHKHACH[i].HO,
				TEN 	 : HANHKHACH[i].TEN
			};
			Passengers.push(data);
		}
		return Passengers;
	},
	
	getTimeBooking : function(){
	    let date = new Date();

	    let hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;

	    let min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;

	    let sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;

	    let year = date.getFullYear();
	    let month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;

	    let day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;

	    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
	}
}

module.exports = helper;
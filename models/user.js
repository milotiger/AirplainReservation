"use strict";

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = new mongoose.Schema({
	username : {
		type : String,
		unique : true,
		required : true
	},
	password : {
		type : String,
		required : true
	}
});

userSchema.pre('save', function( callback ) {
	let user = this;
	if (!user.isModified( 'password' )) return callback();

	bcrypt.genSalt(5, function( err, salt ) {
		if( err ) return callback( err );

		bcrypt.hash(user.password, salt, null, function( err, hash ) {
			if( err ) return callback( err );
			user.password = hash;
			callback();
		});
	});
});

userSchema.methods.verifyPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Users', userSchema, 'Users');
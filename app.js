var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var route = require('./route');

var app = express();


//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	next();
};

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use('/', route);


app.use(express.static(__dirname + '/views'));

var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
'mongodb://hmtri1011:Hoangminhtri1011@ds021356.mlab.com:21356/dagk';

mongoose.Promise = global.Promise;

mongoose.connect(uristring, function( err,res ) {
	if ( err ) {
		console.log('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log('Succeeded connected to: ' + uristring);
	}
});

app.listen(3000);
console.log('Server Started!');


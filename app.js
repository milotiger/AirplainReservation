var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var route = require('./route');
var session = require('express-session');
var path = require('path');

var app = express();


//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	next();
};

app.use(allowCrossDomain);

// Set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// Use express session support since OAuth2orize requires it
app.use(session({
	secret: 'Super Secret Session Key',
	saveUninitialized: true,
	resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

app.use('/', route);

app.get('/admin', function( req, res ) {
	res.sendFile(path.join(__dirname, './admin', 'admin.html'));
})


app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/admin'));

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

var listener = app.listen(process.env.PORT || 3000, function(){
	console.log('Listening on port ' + listener.address().port); //Listening on port 3000
});
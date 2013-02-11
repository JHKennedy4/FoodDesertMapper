
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    stores = require('./routes/stores'),
    http = require('http'),
    path = require('path');

// connect to the heroku MongoDB
mongoose.connect('mongodb://foodMapper:mapper@ds043467.mongolab.com:43467/heroku_app11746687');

var storeSchema = mongoose.Schema({
    Address: String,
    City: String,
    County: String,
    State: String,
    Store_Name: String,
    Zip5: Number,
    Zip4: Number,
    _id: {
        $oid: String
    },
    loc: {
        longitude: Number,
        latitude: Number
    }
});

var Store = mongoose.model('Store', storeSchema);

/*
Store.find(function (err, stores) {
	console.log("findin");
	if (err) {
		console.log('DB Err');
	} else {
		console.log("else");
		console.log(JSON.stringify(stores));
	}
});
*/

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    // yay!
    console.log("connected to the db");
});

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
// get the "resource" markets
app.get('/stores', stores.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    console.log("http://127.0.0.1:3000");
});

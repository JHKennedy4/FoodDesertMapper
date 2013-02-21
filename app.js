
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    stores = require('./routes/stores'),
    form = require('./routes/form'),
    http = require('http'),
    CartoDB = require('cartodb'),
    path = require('path'),
    fs =  require('fs'),
    secret;

if (fs.existsSync('./secret.js')) 
    secret = require('./secret.js');

// var client = new CartoDB({user: secret.USER, api_key: secret.API_KEY});
var client = new CartoDB({user: process.env.USER || secret.USER,
                          api_key: process.env.API_KEY || secret.API_KEY});

client.on('connect', function () {
	console.log("Hello CartoDB!");
});

client.connect();

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
app.get('/form', form.form);
// get the "resource" stores
app.get('/stores',  function (req, res) {
    client.query("select * from monroecountysnap", function (err, data) {
        res.send(data);
    });
    /*
    client.on('error', function (error) {
        console.log("fucuilasdf!");
    });
    client.on('data', function (data) {
        res.send(data);
    });
    */
});
app.get('/stores/:id', function (req, res) {
    var id = req.params.id;
    client.query("select * from monroecountysnap where cartodb_id = " + id);
    client.on('error', function (error) {
        console.log("id fail");
    });
    client.on('data', function (data) {
        res.send(data);
    });
});
    
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    console.log("http://127.0.0.1:" + app.get('port'));
});

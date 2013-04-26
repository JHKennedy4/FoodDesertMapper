
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
    xmljs = require('libxmljs'),
    secret;

// make localhost and heroku happy
// so very, very happy
// helps if you have a "secret.js" file
if (fs.existsSync('./secret.js')) {
    console.log("We're working local!");
    secret = require('./secret.js');
} else {
    secret = {};
    secret.USER = false;
    secret.API_KEY = false;
}

// var client = new CartoDB({user: secret.USER, api_key: secret.API_KEY});
var client = new CartoDB({user: secret.USER || process.env.USER,
                          api_key: secret.API_KEY || process.env.API_KEY});

client.on('connect', function () {
	console.log("Hello CartoDB!");
});

client.connect();

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
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

app.get('/', function (req, res) {
    client.query("select * from monroecountysnap", function (err, data) {
        res.locals.stores = data.rows;
        res.render('index', { title: 'Rochester Food Desert Mapper' });
    });
});

function buildform(store, foodvals) {
    var doc = new xmljs.Document(),
        i,
        form = doc.node("form").attr({
            method: 'GET',
            action: '/update/' + store.cartodb_id
        });
    form.node('h2', "Share what's available at " + store.store_name);
    form.node('input').attr({
        type: "hidden",
        name: "cartodb_id",
        value: store.cartodb_id
    });

    //<h2>Share what's available at <%- name %>:</h2>
    //"<form method='GET' action='/update/" + store.cartodb_id + "'>",
    for (i = 0; i < foodvals.length; i = i + 1) {
        switch (i) {
        case 0 :
            form.node("h4", "Grains");
            break;
        case 4 :
            form.node("h4", "Vegetables");
            break;
        case 9 :
            form.node("h4", "Fruits");
            break;
        case 11 :
            form.node("h4", "Milk Products");
            break;
        case 15 :
            form.node("h4", "Meat and beans");
            break;
        case 21 :
            form.node("h4", "Other foods");
            break;
        }
        form.node('input').attr({
            type: "checkbox",
            id: i + 1,
            name: i + 1
        });
        form.node('label', foodvals[i].description).attr({
            for: i + 1
        });
        form.node('br');
    }
    return doc.toString();
}

app.get('/edit/:id', function (req, res) {
    // got rid of jade, need to fix for ejs
    var id = req.params.id,
        storeData;
    client.query("select * from monroecountysnap where cartodb_id = " + id,
        function (err, data) {
            storeData = data.rows[0];
            //console.log(store);
        })
    .query("select * from foodvalues order by cartodb_id",
        function (err, data) {
            res.locals.form = buildform(storeData, data.rows);
            res.render('form');
        });

}); //form.form);

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
app.get('/store/:id', function (req, res) {
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

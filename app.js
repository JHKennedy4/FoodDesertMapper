
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    stores = require('./routes/stores'),
    form = require('./routes/form'),
    http = require('http'),
    url = require('url'),
    CartoDB = require('cartodb'),
    path = require('path'),
    fs =  require('fs'),
    xmljs = require('libxmljs'),
    querystring = require('querystring'),
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
    res.render('splash');
});

app.get('/map', function (req, res) {
    res.render('index', { title: 'Rochester Food Desert Mapper' });
});

function buildInput(div, na, qu, label) {
    div.node('label', label).attr({
        for: qu + ":"
    });
    div.node('br');
    div.node('label', "$").attr({
        for: na
    });
    div.node('input').attr({
        type: "text",
        name: na,
        id: na
    });
    div.node('span', "/");

    div.node('input').attr({
        type: "text",
        name: qu,
        id: qu
    });
    div.node('br');

}

function buildform(store, foodvals, id) {
    var doc = new xmljs.Document(),
        i,
        form = doc.node("form").attr({
            method: 'GET',
            action: '/insert/' + store.cartodb_id
        }),
        div;
    form.node('input').attr({
        type: "hidden",
        name: "id",
        value: id
    });
    form.node('h2', "Share what's available at " + store.store_name);

    //<h2>Share what's available at <%- name %>:</h2>
    for (i = 0; i < foodvals.length; i = i + 1) {
        switch (i) {
        case 0 :
            // begin page 1
            div = form.node("p", "Please take the time to fill out this form as completely as you can. The data you collect will help neighbors, researchers, and policy makers learn more about food availability in your community.");
            div = form.node("div").attr({
                class: 'page1'
            });
            div.node("h4", "Grains");
            break;
        case 4 :
            // what? you want bread? here's your damn bread
            div.node('label', "$").attr({
                for: 'wheat'
            });
            div.node('input').attr({
                type: "text",
                name: 'wheat_bread_price',
                id: 'wheat'
            });
            div.node('span', " price per wheat loaf");
            div.node('br');

            // next you're gonna tell me you want white bread. fuck you
            div.node('label', "$").attr({
                for: 'white'
            });
            div.node('input').attr({
                type: "text",
                name: 'white_bread_price',
                id: 'white'
            });
            div.node('span', " price per white loaf");
            div.node('br');

            // now we begin page2
            div = form.node("div").attr({
                class: 'page2'
            });
            div.node("h4", "Vegetables");
            break;
        case 9 :
            buildInput(div, "carrot_price", "carrot_weight", "Carrots - price per oz.");

            // yay! page 3!
            div = form.node("div").attr({
                class: 'page3'
            });
            div.node("h4", "Fruits");
            break;
        case 11 :
            // is there fresh fruit?
            div.node('input').attr({
                type: "checkbox",
                id: "freshfruit",
                name: "is_fruit_fresh"
            });
            div.node('label', " Fresh fruit?").attr({
                for: "freshfruit"
            });
            div.node('br');

            buildInput(div, "apple_price", "apple_quantity", "Apples - price per number");
            buildInput(div, "banana_price", "banana_quantity", "Bananas - price per number");
            buildInput(div, "orange_juice_price", "orange_juice_volume", "Orange Juice - price per oz.");
            buildInput(div, "apple_juice_price", "apple_juice_volume", "Apple Juice - price per oz.");

            // let's go to page 4!
            div = form.node("div").attr({
                class: 'page4'
            });
            div.node("h4", "Milk Products");
            break;
        case 15 :
            buildInput(div, "milk_price", "milk_volume", "Milk - price per oz.");

            // welcome to page 5. Meat and beans ftw.
            div = form.node("div").attr({
                class: 'page5'
            });
            div.node("h4", "Meat and beans");
            break;
        case 21 :
            //eggs
            div.node('label', "$").attr({
                for: 'eggs'
            });
            div.node('input').attr({
                type: "text",
                name: 'egg_price',
                id: 'eggs'
            });
            div.node('span', " price per dozen eggs");
            div.node('br');

            div = form.node("div").attr({
                class: 'page6'
            });
            div.node("h4", "Other foods");
            break;
        }
        div.node('input').attr({
            type: "checkbox",
            id: i + 1,
            name: i + 1
        });
        div.node('label', foodvals[i].description).attr({
            for: i + 1
        });
        div.node('br');
    }
    div.node('input').attr({
        type: 'submit',
        name: 'Submit',
		value: 'Submit',
        class: 'btn'
    });
    return doc.toString();
}

// return the store rating form
app.get('/rate/:id', function (req, res) {
    var id = req.params.id,
        storeData;

    client.query("select * from snap where cartodb_id =  " + id, function (err, data) {
            storeData = data.rows[0];
            client.query("select * from foodvalues order by cartodb_id",
                function (err, data) {
                    if (data) {
                        res.locals.form = buildform(storeData, data.rows, id);
                        res.render('form');
                    }
                });
        });
});

// insert the rating data for 
app.get('/insert/:id', function (req, res) {

    //debugger;
    var id = req.params.id,
        url_parts = url.parse(req.url, true),
        query = url_parts.query,
        keys = "",
        cartoquery,
        i,
        values;

    delete query.Submit;
    for (i in query) {
        keys += query[i] !== "" ? i + ", " : "";
    }

    values = "";
    for (i in query) {
        values += query[i] !== "" ? query[i] + ", " : "";
    }

    keys = keys.replace(/(^\s*,)|(,\s*$)/g, '');
    values = values.replace(/(^\s*,)|(,\s*$)/g, '');
    console.log(keys);

    cartoquery = "insert into scores (" + keys + ") values (";
    client.query(cartoquery + values + ")", function (err, data) {
        if (!err) {
            console.log("no err");
            console.log(id);
            console.log(keys);
        } else {
            console.log("error:");
            console.log(err);
        }
    });

    // Respond
    res.statusCode = 301;
    //res.header('Location', "http://food-desert-mapper.jhk.me/map?success=true");
    res.end("<p>Redirecting</p>");
});

// get the "resource" stores
app.get('/stores',  function (req, res) {
    client.query("select * from snap", function (err, data) {
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

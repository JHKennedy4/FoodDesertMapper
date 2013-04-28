var map;

//dojo.require("esri.map");

var Stores = Backbone.Collection.extend({
	url: "http://jhk.cartodb.com/api/v2/sql?q=SELECT * FROM monroecountysnap"
});

var MapView = Backbone.View.extend({
    render: function () {
        console.log("render mapview");
        map = new esri.Map("mapDiv", {
            center: [-77.6068, 43.1562],
            zoom: 13,
            basemap: "streets"
        });
    }
});

function addPoint(store) {
    var infoTemplate = new esri.InfoTemplate("${Name}"),
	//, "Restroom: ${Facilities}<br />Phone: ${Phone}<br />Water: ${Water}");
        infoSymbol = new esri.symbol.PictureMarkerSymbol("../img/icon.png",30,30),
        point = new esri.Graphic({
            "geometry": {
                "x": store.latitude,
                "y": store.longitude,
                "spatialReference": {"wkid": 4326}
            },
            "attributes": {
                "Name": store.name
            }
        });
    point.setSymbol(infoSymbol);
    point.setInfoTemplate(infoTemplate);

    map.graphics.add(point);
}

var StoreMarkers = Backbone.View.extend({
    render: function () {
            console.log("rendering store markers");
            var stores = new Stores();
            stores.fetch({ success: function (stores) {
                    console.log("fetched stores");
                    console.log(JSON.stringify(stores));
                    _.each(stores, addPoint);
                }});
        }
});

var FormView = Backbone.View.extend({
    el: '#mapDiv',
    render: function () {
        this.$el.html("<div class='container-fluid'>"+
		"<div class='row'><div class='span2 offset2'><h1>Food Availability</h1></div></div>" +
		"<div class='span4 offset3'"+
		"<form>"+
		"<h2>Grains</h2>"+
		"<input type='checkbox' name='FoodCat' value='1'>Whole grain breads, rice, pasta, and pastries<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Whole grain Cereals<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Popcorn and other whole grain snacks<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Non-whole grain breads, cereals, rice, pasta, pies, pastries, snacks, and flours<br />"+
		"<h2>Vegetables</h2>"+
		"<input type='checkbox' name='FoodCat' value='1'>All potato products<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Dark green vegetables<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Orange vegetables<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Canned and dry beans, lentils, and peas (legumes)<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Other vegetables<br />"+
		"<h2>Fruits</h2>" +
		"<input type='checkbox' name='FoodCat' value='1'>Whole Fruits<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Fruit Juices<br />"+
		"<h2>Milk Products</h2>"+
		"<input type='checkbox' name='FoodCat' value='1'>Whole Milk, yogurt, and cream<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>Lower fat and skim milk and lowfat yogurt<br />"+
		"<input type='checkbox' name='FoodCat' value='1'>All cheese (including cheese soup and sauce)<br />"+
		"</form>" +
		"</div>" +
		"</div>");
    }
});

var FoodRoutes = Backbone.Router.extend({
    routes: {
        "": "index",
        "submit/:id" : "form",
	"form": "form"
    },
    index: function () {
        var mapView = new MapView(),
            storeMarkers = new StoreMarkers();
        mapView.render();
        // storeMarkers.render();
    },
    form: function () {
        var formView = new FormView();
	formView.render();
    }
});

function zoomToLocation(location) {
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(
                 location.coords.longitude, location.coords.latitude));
    console.log(location.coords.longitude);
    map.centerAndZoom(pt, 16);
}

function locationError(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        alert("Location not provided");
        break;
    case error.POSITION_UNAVAILABLE:
        alert("Current location not available");
        break;
    case error.TIMEOUT:
        alert("Timeout");
        break;
    default:
        alert("unknown error");
        break;
    }
}


$(document).ready(function () {
    // Initialize the router.
    var router = new FoodRoutes();
    Backbone.history.start({pushState: true});

    //if (navigator.geolocation) {
        //navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    //}
});

/*
//var markers = new StoreMarkers();
router.on('route:index', function () {
	console.log("router.on( index)");
});
*/

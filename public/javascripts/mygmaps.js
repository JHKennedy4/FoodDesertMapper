var map;


var Stores = Backbone.Collection.extend({
	url: "stores"
});

var MapView = Backbone.View.extend({
    render: function () {
        console.log("render mapview");
        var mapOptions, myloc;
        myloc = new google.maps.LatLng(43.1562, -77.6068);
	//if(navigator.geolocation) {

        mapOptions = {
            center: myloc,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);
    }
});

var StoreMarkers = Backbone.View.extend({
    render: function () {
            var stores = new Stores();
            stores.fetch(function (stores) {
                var length,
                    i,
                    marker;
                length = stores.length;
                for (i = 0; i < length; i += 1) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(stores[i].loc.latitude, stores[i].loc.longitude),
                        map: map,
                        title: "Hello World!"
                    });
                }
            });
        }
});

var FoodRoutes = Backbone.Router.extend({
    routes: {
        "": "index",
        "submit/:id" : "form"
    },
    index: function () {
        var mapView = new MapView();
        mapView.render();
        console.log("fuck");
    }
});

$(document).ready(function () {
  // Initialize the router.
	var router = new FoodRoutes();
	Backbone.history.start({pushState: true});

});

/*
//var markers = new StoreMarkers();
router.on('route:index', function () {
	console.log("router.on( index)");
});
*/

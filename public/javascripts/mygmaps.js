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
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);
    }
});

var StoreMarkers = Backbone.View.extend({
    render: function () {
	    var snapLayer = new google.maps.FusionTablesLayer('11ripikPPqtD0Bap-NqJ2dAD33mvMZAC8ZYxuLb0');
	    snapLayer.setMap(map);
	    /*
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
	    */
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
        var mapView = new MapView();
	var storeMarkers = new StoreMarkers()
        mapView.render();
	storeMarkers.render();
    },
    form: function () {
        var formView = new FormView();
	formView.render();
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

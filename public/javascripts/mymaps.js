var map, data;

dojo.require("esri.map");

function zoomToLocation(location) {
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(
                location.coords.longitude, location.coords.latitude));
    console.log(location.coords.longitude);
    map.centerAndZoom(pt, 15);
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

function addPoint(store) {
	console.log(store.store_name);
    var infoTemplate = new esri.InfoTemplate("${Name}"),
	infoSymbol =  new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10),
        point = new esri.Graphic({
            "geometry": {
                "x": store.latitude,
                "y": store.longitude,
                "spatialReference": {"wkid": 4326}
            },
            "attributes": {
                "Name": store.store_name
            }
        });
    point.setSymbol(infoSymbol);
    point.setInfoTemplate(infoTemplate);

    map.graphics.add(point);

}

function init() {
        //Rochester, NY: 43.1547, -77.6158
        map = new esri.Map("mapDiv", {
            center: [-77.6068, 43.1562],
            zoom: 13,
            basemap: "streets"
        });
        $.ajax("/stores", {
            dataType: "json",
        }).done(function (data) {
            // works!
            console.log(data);
            _.each(data.rows, addPoint);
        }).fail(function () {
            alert("failasaurous-rex");
        });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
        }
}

dojo.addOnLoad(init);

var map;
dojo.require("esri.map");

function zoomToLocation(location) {
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(
                 location.coords.longitude, location.coords.latitude));
    map.centerAndZoom(pt, 16);
}

function locationError(error) {

}

function init() {
    //Rochester, NY: 43.1547, -77.6158
    map = new esri.Map("mapDiv", {
        // change to user location
        center: [-77.6068, 43.1562],
        zoom: 13,
        basemap: "streets"
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    }
}

dojo.addOnLoad(init);

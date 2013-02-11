var map;

dojo.require("esri.map");

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

function addSymbol() {

    var myPoint = {"geometry":{"x":-104.4140625,"y":69.2578125, "spatialReference":{"wkid":4326}},"attributes":{"XCoord":-104.4140625, "YCoord":69.2578125,"Plant":"Mesa Mint"},"symbol":{"color":[255,0,0,128], "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS", "style":"esriSMSSquare","outline":{"color":[0,0,0,255],"width":1, "type":"esriSLS","style":"esriSLSSolid"}}, "infoTemplate":{"title":"Vernal Pool Locations","content":"Latitude: ${YCoord} <br/> Longitude: ${XCoord} <br/> Plant Name:${Plant}"}};

    var gra = new esri.Graphic(myPoint);
    map.addLayer(gra);
}

function init() {
    //Rochester, NY: 43.1547, -77.6158
    map = new esri.Map("mapDiv", {
        center: [-77.6068, 43.1562],
        zoom: 13,
        basemap: "streets"
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    }

    /*
    //addSymbol();
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(
                 -104.4140625, 69.2578125, new esri.SpatialReference({ wkid: 4326 })));
    console.log(pt);
    map.centerAndZoom(pt, 16);
    */

}

dojo.addOnLoad(init);

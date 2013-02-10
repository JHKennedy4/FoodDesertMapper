var map;
dojo.require("esri.map");

function init() {
    //Rochester, NY: 43.1547, -77.6158
    map = new esri.Map("mapDiv", {
	// change to user location
        center: [-77.6068, 43.1562],
        zoom: 14,
        basemap: "streets"
    });
}

dojo.addOnLoad(init);

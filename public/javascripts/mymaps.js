var map;

function init() {
    //Rochester, NY: 43.1547, -77.6158
    map = new esri.Map("mapDiv", {
        center: [43.1547, -77.6158],
        zoom: 3,
        basemap: "streets"
    });
}

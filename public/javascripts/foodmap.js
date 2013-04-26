var layer =  new L.StamenTileLayer("toner");

F.map = new L.map('map', {
    center: new L.LatLng(43.1547, -77.6158),
    zoom: 10
});

F.map.addLayer(layer);

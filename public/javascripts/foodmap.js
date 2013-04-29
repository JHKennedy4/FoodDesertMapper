var baseMap =  new L.StamenTileLayer("toner");

function main() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            F.map = new L.map('map', {
                center: new L.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16
            });

            F.map.addLayer(baseMap);

            var userMarker = L.AwesomeMarkers.icon({
                icon: 'icon-user',
                color: 'red'
            });

            L.marker([position.coords.latitude, position.coords.longitude], {icon: userMarker}).bindPopup('<p>You are here</p>').addTo(F.map);

            var layerUrl = 'http://jhk.cartodb.com/api/v1/viz/snap/viz.json',
                layerOptions = {
                    query: 'select cartodb_id, store_name, the_geom_webmercator from {{table_name}}',
                };
            cartodb.createLayer(F.map, layerUrl, layerOptions)
                .on('done', function (layer) {
                    console.log("adding layer");
                    F.map.addLayer(layer);
                    layer.infowindow.set('template', $('#infowindow_template').html());
            }).on('error', function (err) {
                console.log("Error: " + err);
            });

        });
    }
}

window.onload = main;

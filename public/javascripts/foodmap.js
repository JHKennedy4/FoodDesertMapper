var baseMap =  new L.StamenTileLayer("toner");

function main() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userMarker,
                layerUrl,
                layerOptions;

            // create a new map at your location
            F.map = new L.map('map', {
                center: new L.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16
            });

            // add the baseMap to the layer
            F.map.addLayer(baseMap);

            // options for the AwesomeMarker
            userMarker = L.AwesomeMarkers.icon({
                icon: 'icon-user',
                color: 'red'
            });

            // create an AwesomeMarker at the user location
            L.marker([position.coords.latitude, position.coords.longitude], {icon: userMarker}).bindPopup('<p>You are here</p>').addTo(F.map);

            // the layer url and options from CartoDB
            // not sure if the query in layerOptions is actually necessary
            layerUrl = 'http://jhk.cartodb.com/api/v1/viz/snap/viz.json';
            layerOptions = {
                query: 'select cartodb_id, store_name, the_geom_webmercator from {{table_name}}',
            };

            cartodb.createLayer(F.map, layerUrl, layerOptions)
                .on('done', function (layer) {
                    console.log("adding layer");
                    console.log(layer);
                    F.map.addLayer(layer);
                    layer.setCartoCSS("#snap { " +
                        "marker-file:url('http://food-desert-mapper.jhk.me/carticon.svg');" +
                        //"marker-opacity: 1; " +
                        //"marker-width: 40; " +
                        //"marker-line-color: white; " +
                        //"marker-line-width: 3; " +
                        //"marker-line-opacity: 0.9; " +
                        "marker-placement: point; " +
                        //"marker-type: ellipse; " +
                        "marker-allow-overlap: false; }");
                    layer.infowindow.set('template', $('#infowindow_template').html());
                    layer.infowindow.addField('cartodb_id');
                })
                .on('error', function (err) {
                    console.log("Error: " + err);
                });

        });
    }
}

$(document).ready(main());

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
                zoom: 15
            });

            // add the baseMap to the layer
            F.map.addLayer(baseMap);

            // options for the AwesomeMarker
            userMarker = L.icon({
                iconUrl: '/bootstrap/here.svg',
                iconSize:     [76, 190], // size of the icon
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            // create an AwesomeMarker at the user location
            L.marker([position.coords.latitude, position.coords.longitude], {icon: userMarker}).bindPopup('<p>You are here</p>').addTo(F.map);

            //Suzanne's stupid code

            F.marketLayer = {};
            $.ajax({url: 'http://jhk.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT cartodb_id, the_geom_webmercator store_name, the_geom FROM snap WHERE the_geom %26%26 ST_MakeEnvelope(' + F.map.getBounds().toBBoxString() + ') LIMIT 1000'})
                .done(function (data) {
                    console.log(data);
                    F.marketLayer = L.geoJson(data).addTo(F.map);
                })
                .fail(function () {
                    alert("fail");
                });

            F.map.on('movestart', function () {
                F.marketLayer.clearLayers();
            });
            F.map.on('dragstart', function () {
                F.marketLayer.clearLayers();
            });
            F.map.on('zoomstart', function () {
                F.marketLayer.clearLayers();
            });

            F.map.on('moveend', function () {
                $.ajax({url: 'http://jhk.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT cartodb_id, the_geom_webmercator, store_name, the_geom FROM snap WHERE the_geom %26%26 ST_MakeEnvelope(' + F.map.getBounds().toBBoxString() + ') LIMIT 1000'})
                    .done(function (data) {
                        console.log(data);
                        F.marketLayer = L.geoJson(data).addTo(F.map);
                    })
                    .fail(function () {
                        alert("fail");
                    });
            });

        });
    }
}

$(document).ready(main());



var baseMap =  new L.StamenTileLayer("toner");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        F.map = new L.map('map', {
            center: new L.LatLng(position.coords.latitude, position.coords.longitude),
            zoom: 14
        });

        F.map.addLayer(baseMap);

        var userMarker = L.AwesomeMarkers.icon({
            icon: 'icon-user',
            color: 'red'
        });

        L.marker([position.coords.latitude, position.coords.longitude], {icon: userMarker}).bindPopup('<p>You are here</p>').addTo(F.map);


        /*
        cartodb.createLayer(F.map, {
            type: 'cartodb',
            options: {
                table_name: 'snap',
                user_name: 'jhk',
                query: "select cartodb_id, store_name, the_geom_webmercator from snap"
            }
        }).done(function (layer) {
            console.log("adding layer");
            F.map.addLayer(layer);
        });
        */


    });
}

/*
$.ajax('http://jhk.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT DISTINCT ON (account_name) * FROM pcp LIMIT 28&api_key=c3c310cb4bf016cd634e4df3d0a88b82826a4fbb', {
        dataType: "json",
    }).done(function (data) {
        // works!
        console.log(data);
        _.each(data.features, addPoint);
    }).fail(function () {
        alert("failasaurous-rex");
    });

    */


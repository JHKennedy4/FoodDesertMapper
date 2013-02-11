db.stores.find().forEach(
    function (e) {
        // update document, using its own properties
        e.location = { longitude: e.loc.longitude, latitude: e.loc.latitude };

        // save the updated document
        db.stores.save(e);
    }
);

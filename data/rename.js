db.stores.find().forEach(
    function (d) {
        db.stores.update({"_id": d._id}, {$rename: {"location": "loc"}});
    }
);

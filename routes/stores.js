
/*
 * GET stores collection.
 */

exports.list = function (req, res) {
    var Store = mongoose.model('Store', storeSchema);
    var stores = new Store();
    res.send(stores.find(
        {'State': 'NY', 'City': 'Rochester'},
        function (err, stores) {
            if (err) {
                console.log('DB Err');
            } else {
                console.log(JSON.stringify(stores));
            }
        }
    ));
};

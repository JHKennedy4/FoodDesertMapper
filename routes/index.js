
/*
 * GET home page.
 */

exports.index = function (req, res, client) {
    client.query("select * from monroecountysnap", function (err, data) {
        res.locals.stores = data.rows;
        res.render('index', { title: 'Rochester Food Desert Mapper' });
    });

};

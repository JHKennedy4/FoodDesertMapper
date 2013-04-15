
/*
 * GET home page.
 */

exports.form = function (req, res) {
    // got rid of jade, need to fix for ejs
    var id = req.params.id;
    client.query("select * from monroecountysnap where cartodb_id = " + id,
            function (err, data) {
                res.render('form', { store: data });
            });
};

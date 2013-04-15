
/*
 * GET home page.
 */

exports.form = function (req, res) {
    // got rid of jade, need to fix
    res.render('form', { title: 'Rochester Food Desert Mapper' });
};

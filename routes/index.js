
/*
 * GET home page.
 */

exports.index = function (req, res) {
    // got rid of jade, need to fix
    res.render('index', { title: 'Rochester Food Desert Mapper' });
};

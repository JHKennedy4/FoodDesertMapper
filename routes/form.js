
/*
 * GET home page.
 */

exports.form = function (req, res) {
    // got rid of jade, need to fix for ejs
    res.render('form', { title: 'EJS Works!' });
};

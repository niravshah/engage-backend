module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('login');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/welcome', function (req, res) {
        res.render('welcome');
    });

    app.get('/reset', function (req, res) {
        res.render('reset');
    });
};
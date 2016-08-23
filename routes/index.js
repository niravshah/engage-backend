module.exports = function(app) {
    var firebase = require('firebase');

    firebase.initializeApp({
        serviceAccount: __dirname + "/mwtest.json"
    });

    app.get('/index', function (req, res) {
        res.render('index');
    });

    app.get('/home/:id', function (req, res) {
        res.render('home', {sid: req.params.id});
    });
};

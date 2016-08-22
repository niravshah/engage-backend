module.exports = function(app) {
    var firebase = require('firebase');

    firebase.initializeApp({
        serviceAccount: __dirname + "/mwtest.json"
    });

    app.get('/index', function (req, res) {
        res.render('index');
    });

    app.get('/project/:id', function (req, res) {
        res.render('project', {pid: req.params.id});
    });

    app.get('/profile/:id', function (req, res) {
        res.render('profile', {sid: req.params.id});
    });
};

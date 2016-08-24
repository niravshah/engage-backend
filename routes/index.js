module.exports = function(app) {
    var firebase = require('firebase');
    var jwt = require('jsonwebtoken');

    firebase.initializeApp({
        serviceAccount: __dirname + "/mwtest.json"
    });

    app.get('/index', function (req, res) {
        res.render('index');
    });

    app.get('/home', function (req, res) {
        if(req.cookies.jwt) {
            var decoded = jwt.verify(req.cookies.jwt, 'secret_sauce');
            res.render('home', {sid: decoded._doc.shortid});
        }else{
            res.redirect('/login');
        }
    });
};

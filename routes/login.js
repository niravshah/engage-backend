var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('login');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/welcome', function(req, res) {
    res.render('welcome');
});

module.exports = router;
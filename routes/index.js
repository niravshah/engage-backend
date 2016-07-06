var express = require('express');
var router = express.Router();

router.get('/index', function (req, res) {
    console.log('Index Function')
    res.render('index');
});

router.get('/project/:id', function (req, res, next) {
    res.render('project', {pid: req.params.id});
});
module.exports = router;

var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/index', function(req, res, next) {
    res.render('index');
});

router.get('/project/:id', function(req, res, next) {
    res.render('project',{pid:req.params.id});
});

router.get('/users', function (req, res, next) {
        User.find(function (err, users) {
            if (err){
                console.log('Callback Function', err);
                next(err);
            }
            else{
                res.json(users);
            }
        });
    });
module.exports = router;
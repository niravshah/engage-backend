var express = require('express');
var router = express.Router();
var User = require('../models/user');


router.get('/', function(req, res, next) {
    res.render('index');
});


router.get('/create', function(req, res, next) {
    var myFoo = new User({
        name: 'Test Name 2',
        email: '1232@456.com',
        password: '1223456789'
    });
    myFoo.save(req, function(err, result) {
        if(err){
         console.log('User Save Error', err)   ;
            res.status(500).send(err);
        }else{
        console.log('User Saved');
            res.status(200).send(result)
        }
    });
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
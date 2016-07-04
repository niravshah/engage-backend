var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
    res.render('login');
});


router.post('/setup', function(req, res, next) {
    var myFoo = new User({
        name: 'Test User',
        email: 'test@email.com',
        password: '123456'
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

router.post('/authenticate', function(req, res, next) {
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if(err) throw err;
            if(!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if(user) {
                if(user.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    var token = jwt.sign(user, 'secret_sauce', {expiresIn:"1h"});
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
});

module.exports = router;
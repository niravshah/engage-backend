var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
    res.render('login');
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
                    res.cookie('jwt',token,{httpOnly:true});
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
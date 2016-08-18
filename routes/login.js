var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var firebase = require('firebase');
var shortid = require('shortid');

router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/authenticate', function(req, res) {

    User.findOne({
            email: req.body.email
        }, function(err, user) {
            if(err){
                res.json({
                    success: false,
                    message: 'Unexpected Error' + err.message
                });
            }
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
                    var firebaseToken = firebase.auth().createCustomToken(user._id.toString(),{roles:user.roles,memberships:user.memberships.toString()});
                    delete user.password;
                    var token = jwt.sign(user, 'secret_sauce', {expiresIn:"4h"});
                    res.cookie('jwt',token,{httpOnly:true});
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        firebaseToken: firebaseToken,
                        tenant:req.body.tid
                    });
                }
            }
        });
});

module.exports = router;
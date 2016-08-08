var express = require('express');
var router = express.Router();
var User = require('../models/user');


router.post('/setup/admin', function(req, res, next) {
    var myFoo = new User({
        name: 'Admin User',
        email: 'admin@u.com',
        password: '123456',
        roles:['user','admin'],
        tid: req.body.tid
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

router.post('/setup/user', function(req, res, next) {
    var newUser = new User({
        name: 'Normal User',
        email: 'user@u.com',
        password: '123456',
        roles:['user'],
        tid: req.body.tid
    });
    newUser.save(req, function(err, result) {
        if(err){
            console.log('User Save Error', err)   ;
            res.status(500).send(err);
        }else{
            console.log('User Saved');
            res.status(200).send(result)
        }
    });
});

module.exports = router;
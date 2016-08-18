var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/setup/user', function (req, res, next) {

    new User({
        "firstName": "Roger",
        "lastName": "Freeman",
        "email": "roger@ew.com",
        "avatar": "/img/avatars/roger.jpg",
        "password": "123456",
        "userRoles": ['user'],
        "memberships": ["localhost-P1"],
        "projectRoles": [{"localhost-P1": "Team Member"}],
        "badges":["/img/badges/badge1.png"],
        "tid": "localhost"
    }).save();

    new User({
        "firstName":"Robin",
        "lastName":"Wills",
        "email":"robin@ew.com",
        "avatar":"/img/avatars/robin.jpg",
        "password": "123456",
        "userRoles": ['user'],
        "memberships": ["localhost-P1"],
        "badges":["/img/badges/badge3.png"],
        "projectRoles": [{"localhost-P1": "Project Manager"}],
        "tid": "localhost"
    }).save();

    new User({
        "firstName":"Anna",
        "lastName":"Smith",
        "email":"anna@ew.com",
        "avatar":"/img/avatars/anna.jpg",
        "password": "123456",
        "userRoles": ['user'],
        "badges":["/img/badges/badge2.png"],
        "memberships": ["localhost-P1"],
        "projectRoles": [{"localhost-P1": "Communications Manager"}],
        "tid": "localhost"
    }).save();

    new User({
        "firstName":"Deel",
        "lastName":"Marlow",
        "email":"deel@ew.com",
        "avatar":"/img/avatars/deel.jpg",
        "password": "123456",
        "userRoles": ['user'],
        "memberships": ["localhost-P1"],
        "badges":["/img/badges/badge1.png","/img/badges/badge1.png"],
        "projectRoles": [{"localhost-P1": "Team Member"}],
        "tid": "localhost"
    }).save();

    new User({
        "firstName":"Mike",
        "lastName":"Herrington",
        "email":"mike@ew.com",
        "avatar":"/img/avatars/mike.jpg",
        "password": "123456",
        "userRoles": ['user'],
        "memberships": ["localhost-P1"],
        "badges":["/img/badges/badge2.png"],
        "projectRoles": [{"localhost-P1": "Team Member"}],
        "tid": "localhost"
    }).save();

    new User({
        "firstName":"John",
        "lastName":"Douey",
        "email":"john@ew.com",
        "avatar":"/img/avatars/john.jpg",
        "password": "123456",
        "userRoles": ['user'],
        "memberships": ["localhost-P1"],
        "badges":["/img/badges/badge2.png"],
        "projectRoles": [{"localhost-P1": "Team Member"}],
        "tid": "localhost"
    }).save();

    res.json({"message":"done"});
});

module.exports = router;
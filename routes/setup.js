var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Project = require('../models/project');
var shortid = require('shortid');

router.post('/setup/project', function (req, res) {
    new Project({
        "tid":"localhost",
        "sid":"P1",
        "name":"Kids London Break",
        "logo":"/img/icon_75_75.png",
        "description":"<p> The break provides children with the space to have fun and enjoy by taking part in activities such as rock climbing, swimming, going to theme parks, cinema and fun-filled. </p> <p> The encouragement, high level energy and one to one attention the children receive from professional role models is invaluable for the children's self-esteem and aspirations. </p>",
        "sDate":"15 Oct 2016",
        "eDate":"20 Oct 2016",
        "aboutOrg":"<p>Whenever anyone looks back on their childhood, most will undoubtedly comment on the perks of being ‘carefree’, but for many children across the UK this is sadly not the case. For some children, day to day life is complicated with stresses and situations that even the toughest of adults would struggle with. At Kids Adventure we believe that every child deserves to be just that. A child.</p> <p>Kids Adventure provides non-residential respite breaks for disadvantaged children aged 8-11 years. The program is run by teams of professional volunteers who provide desperately needed breaks for children and families within their local communities.</p>",
        "orgContact":"",
        "otherResources":""
    }).save(function(error,result){
        if(error){
            res.json({"message":"error","error":error});
        }else{
            res.json({"message":"done","result":result});
        }
    });

});

router.post('/setup/user', function (req, res) {

    new User({
        "shortid":shortid.generate(),
        "firstName": "Roger",
        "lastName": "Freeman",
        "title":"Project Manager",
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
        "shortid":shortid.generate(),
        "firstName":"Robin",
        "lastName":"Wills",
        "title":"Project Manager",
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
        "shortid":shortid.generate(),
        "firstName":"Anna",
        "lastName":"Smith",
        "title":"Project Manager",
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
        "shortid":shortid.generate(),
        "firstName":"Deel",
        "lastName":"Marlow",
        "title":"Project Manager",
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
        "shortid":shortid.generate(),
        "firstName":"Mike",
        "lastName":"Herrington",
        "title":"Project Manager",
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
        "shortid":shortid.generate(),
        "firstName":"John",
        "lastName":"Douey",
        "title":"Project Manager",
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
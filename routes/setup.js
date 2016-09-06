var User = require('../models/user');
var Project = require('../models/project');
var Profile = require('../models/userprofile');
var Misc = require('../models/misc');
var shortid = require('shortid');

module.exports = function(app,bcrypt) {
    app.post('/setup/project', function (req, res) {
        new Project({
            "tid": req.body.tid,
            "sid": "P1",
            "name": "Kids London Break",
            "logo": "/img/icon_75_75.png",
            "description": "<p> The break provides children with the space to have fun and enjoy by taking part in activities such as rock climbing, swimming, going to theme parks, cinema and fun-filled. </p> <p> The encouragement, high level energy and one to one attention the children receive from professional role models is invaluable for the children's self-esteem and aspirations. </p>",
            "sDate": "15 Oct 2016",
            "eDate": "20 Oct 2016",
            "aboutOrg": "<p>Whenever anyone looks back on their childhood, most will undoubtedly comment on the perks of being ‘carefree’, but for many children across the UK this is sadly not the case. For some children, day to day life is complicated with stresses and situations that even the toughest of adults would struggle with. At Kids Adventure we believe that every child deserves to be just that. A child.</p> <p>Kids Adventure provides non-residential respite breaks for disadvantaged children aged 8-11 years. The program is run by teams of professional volunteers who provide desperately needed breaks for children and families within their local communities.</p>",
            "orgContact": "",
            "otherResources": ""
        }).save(function (error, result) {
            if (error) {
                res.json({"message": "error", "error": error});
            } else {
                res.json({"message": "done", "result": result});
            }
        });

    });

    app.post('/setup/user', function (req, res) {

        new User({
            "shortid": "SJzN5Wqc",
            "firstName": "Roger",
            "lastName": "Freeman",
            "title": "Project Manager",
            "email": "roger@ew.com",
            "avatar": "/img/avatars/roger.jpg",
            "password": bcrypt.hashSync("123456", 10),
            "userRoles": ['user'],
            "memberships": ["localhost-P1"],
            "projectRoles": {"localhost-P1": "Team Member"},
            "tid": req.body.tid,
            "aboutMe": "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
        }).save(function(err,user){
            console.log(user);
            var profile = new Profile();
            profile.user = user;
            profile.tid = req.body.tid;
            profile.save(function(err,profile){
                if(err){
                    console.log('Error', err);
                }else{
                    user.profile = profile;
                    user.save();
                }
            });
        });

        new User({
            "shortid": "ByeME9W9c",
            "firstName": "Robin",
            "lastName": "Wills",
            "title": "Project Manager",
            "email": "robin@ew.com",
            "avatar": "/img/avatars/robin.jpg",
            "password": bcrypt.hashSync('123456', 10),
            "userRoles": ['user'],
            "memberships": ["localhost-P1"],
            "projectRoles": {"localhost-P1": "Project Manager"},
            "tid": req.body.tid,
            "aboutMe": "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
        }).save(function(err,user){
            console.log(user);
            var profile = new Profile();
            profile.user = user;
            profile.tid = req.body.tid;
            profile.save(function(err,profile){
                if(err){
                    console.log('Error', err);
                }else{
                    user.profile = profile;
                    user.save();
                }
            });
        });

        new User({
            "shortid": "HJWzE5W5c",
            "firstName": "Anna",
            "lastName": "Smith",
            "title": "Project Manager",
            "email": "anna@ew.com",
            "avatar": "/img/avatars/anna.jpg",
            "password": bcrypt.hashSync("123456", 10),
            "userRoles": ['user'],
            "memberships": ["localhost-P1"],
            "projectRoles": {"localhost-P1": "Communications Manager"},
            "tid": req.body.tid,
            "aboutMe": "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
        }).save(function(err,user){
            console.log(user);
            var profile = new Profile();
            profile.user = user;
            profile.tid = req.body.tid;
            profile.save(function(err,profile){
                if(err){
                    console.log('Error', err);
                }else{
                    user.profile = profile;
                    user.save();
                }
            });
        });

        new User({
            "shortid": "HJGGNcb9q",
            "firstName": "Deel",
            "lastName": "Marlow",
            "title": "Project Manager",
            "email": "deel@ew.com",
            "avatar": "/img/avatars/deel.jpg",
            "password": bcrypt.hashSync("123456", 10),
            "userRoles": ['user'],
            "memberships": ["localhost-P1"],
            "projectRoles": {"localhost-P1": "Team Member"},
            "tid": req.body.tid,
            "aboutMe": "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
        }).save(function(err,user){
            console.log(user);
            var profile = new Profile();
            profile.user = user;
            profile.tid = req.body.tid;
            profile.save(function(err,profile){
                if(err){
                    console.log('Error', err);
                }else{
                    user.profile = profile;
                    user.save();
                }
            });
        });

        new User({
            "shortid": "ByQGN9Zc5",
            "firstName": "Mike",
            "lastName": "Herrington",
            "title": "Project Manager",
            "email": "mike@ew.com",
            "avatar": "/img/avatars/mike.jpg",
            "password": bcrypt.hashSync("123456", 10),
            "userRoles": ['user'],
            "memberships": ["localhost-P1"],
            "projectRoles": {"localhost-P1": "Team Member"},
            "tid": req.body.tid,
            "aboutMe": "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
        }).save(function(err,user){
            console.log(user);
            var profile = new Profile();
            profile.user = user;
            profile.tid = req.body.tid;
            profile.save(function(err,profile){
                if(err){
                    console.log('Error', err);
                }else{
                    user.profile = profile;
                    user.save();
                }
            });
        });

        new User({
            "shortid": "SyEz4qbcq",
            "firstName": "John",
            "lastName": "Douey",
            "title": "Project Manager",
            "email": "john@ew.com",
            "avatar": "/img/avatars/john.jpg",
            "password": bcrypt.hashSync("123456", 10),
            "userRoles": ['user'],
            "memberships": ["localhost-P1"],
            "projectRoles": {"localhost-P1": "Team Member"},
            "tid": req.body.tid,
            "aboutMe": "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
        }).save(function(err,user){
            console.log(user);
            var profile = new Profile();
            profile.user = user;
            profile.tid = req.body.tid;
            profile.save(function(err,profile){
                if(err){
                    console.log('Error', err);
                }else{
                    user.profile = profile;
                    user.save();
                }
            });
        });

        res.json({"message": "done"});
    });

    app.post("/setup/badges",function(req,res){

        new Misc({
            sid: shortid.generate(),
            tid:req.body.tid,
            type: "badge",
            name:"Badge 1",
            url:"/img/badges/badge1.png",
            description:"Badge 1"
        }).save(function(err){
            if(err) console.log(err)
        });

        new Misc({
            sid: shortid.generate(),
            tid:req.body.tid,
            type: "badge",
            name:"Badge 2",
            url:"/img/badges/badge2.png",
            description:"Badge 2"
        }).save(function(err){
            if(err) console.log(err)
        });

        new Misc({
            sid: shortid.generate(),
            tid:req.body.tid,
            type: "badge",
            name:"Badge 3",
            url:"/img/badges/badge3.png",
            description:"Badge 3"
        }).save(function(err){
            if(err) console.log(err)
        });

        res.json({"message": "done"});
    });

};
module.exports = function(app) {
    var User = require('../../models/user');
    var Project = require('../../models/project');
    var request = require('request');
    var ENGAGE_SITE_URL = "http://localhost:9000";

    app.get('/api/projects/:id/members', function (req, res) {
        var membershipId = req.body.tid + "-" + req.params.id;
        User.find({
            memberships: membershipId,
            tid: req.body.tid
        }, 'firstName lastName email avatar badges projectRoles', function (err, users) {
            if (err) {
                res.status(500).json({success: false, err: err});
            } else {
                /*users.forEach(function(user){
                });*/
                res.json({success: true, users: users})
            }
        });
    });

    app.get('/api/projects/:id/info', function (req, res) {

        Project.findOne({sid: req.params.id, tid: req.body.tid}, function (err, project) {
            if (err) {
                res.status(500).json({success: false, err: err});
            } else {
                res.json({success: true, project: project})
            }
        });

    });

    app.get('/api/projects/available',function(req,res){
        request
            .get(ENGAGE_SITE_URL + "/api/projects/available")
            .on('response',function(res){
                console.log(res);
            })
            .on('error',function(err){
                console.log(err);
            })
    });
};

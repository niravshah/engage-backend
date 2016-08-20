module.exports = function(app) {
    var User = require('../../models/user');
    var Project = require('../../models/project');

    app.get('/projects/:id/members', function (req, res) {
        var membershipId = req.body.tid + "-" + req.params.id;
        User.find({
            memberships: membershipId,
            tid: req.body.tid
        }, 'firstName lastName email avatar badges', function (err, users) {
            if (err) {
                res.status(500).json({success: false, err: err});
            } else {
                res.json({success: true, users: users})
            }
        });
    });

    app.get('/projects/:id/info', function (req, res) {

        Project.findOne({sid: req.params.id, tid: req.body.tid}, function (err, project) {
            if (err) {
                res.status(500).json({success: false, err: err});
            } else {
                res.json({success: true, project: project})
            }
        });

    });
}

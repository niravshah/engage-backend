module.exports = function (app) {
    var User = require('../../models/user');
    var Project = require('../../models/project');
    var Survey = require('../../models/survey');
    var shortid = require('shortid');
    var async = require('async');

    app.post('/api/project/:id/survey', function (req, res) {

        var from = req.body.from;
        var ratings = req.body.ratings;

        async.parallel([function (callback) {

            Project.findOne({sid: req.params.id, tid: req.body.tid}, function (err, project) {
                if (err) {
                    callback(err, null);
                } else {
                    if (project) {
                        callback(null, project);
                    } else {
                        callback(new Error('Could not find the project to save this survey'), null);
                    }
                }
            });


        }, function (callback) {

            User.findOne({sid: from.sid, tid: req.body.tid}, function (err, user) {
                if (err) {
                    callback(err, null);
                } else {
                    if (user) {
                        callback(null, user);
                    } else {
                        callback(new Error('Could not find the From User to save this survey'), null);
                    }
                }
            })

        }], function (err, results) {

            if (err) {
                res.json({success: false, message: err.message, error: err})
            } else {

                async.each(ratings, function (r, callback) {

                    User.findOne({shortid: r.shortid, tid: req.body.tid}, function (err, user) {
                        if (err) {
                            callback(err);
                        } else {
                            if (user) {
                                var newSurvey = new Survey();
                                newSurvey.project = results[0];
                                newSurvey.sid = shortid.generate();
                                newSurvey.tid = req.body.tid;
                                newSurvey.survey = r;
                                newSurvey.to = user;
                                newSurvey.from = results[1];
                                newSurvey.save(function (err) {
                                    if (err) {
                                        callback(err)
                                    } else {
                                        callback(null);
                                    }
                                });

                            }else{
                                callback(new Error('No To User Found for id: ' + r.shortid ));
                            }
                        }
                    });

                }, function (err) {
                    if (err) {
                        res.json({success: false, message: err.message, error: err})
                    } else {
                        res.json({success: true, message: 'Survey Saved'})
                    }
                });
            }
        });
    });
};
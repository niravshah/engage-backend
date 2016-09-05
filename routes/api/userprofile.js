module.exports = function (app) {

    var Profile = require('../../models/userprofile');
    var User = require('../../models/user');

    app.get('/api/user/:id/profile', function (req, res) {
        Profile.findOne({user: req.params.id}, function (err, profile) {
            if (err) {
                res.json({success: false, message: err.message});
            } else {
                if (profile) {
                    res.json({success: true, profile: profile});
                } else {
                    res.json({success: false, message: "Could not find a profile for this user"});
                }
            }
        });

    });

    app.post('/api/user/:id/profile', function (req, res) {
        console.log(req.body);
        Profile.findOneAndUpdate({user: req.params.id}, req.body.data, {upsert: true}, function (err, profile) {
            if (err) {
                res.json({success: false, message: err.message});
            } else {
                if (profile) {
                    res.json({success: true, profile: profile});
                } else {
                    res.json({success: true, message: "Created new profile for the user"});
                }
            }
        });

    });

    app.post('/api/user/:id/badge', function (req, res) {
        console.log(req.body);
        User.findOne({shortid: req.params.id}, function (err, user) {
            if (err) {
                res.json({success: false, message: "Error finding user " + err.message});
            } else {
                if (user) {
                    Profile.findOne({user: user}, function (err, profile) {
                        if (err) {
                            res.json({success: false, message: "Error finding profile " + err.message});
                        } else {
                            if (profile) {

                                delete req.body.tid;
                                delete req.body.receiver;

                                profile.badges.push(req.body);
                                profile.save(function (err) {
                                    if (err) {
                                        res.json({success: false, message: "Error saving profile " + err.message});
                                    } else {
                                        res.json({success: true});
                                    }
                                });
                            } else {
                                res.json({success: false, message: "Profile not found"});
                            }
                        }
                    })
                } else {
                    res.json({success: false, message: "User not found"});
                }
            }
        })
    });
    app.post('/api/user/:id/review', function (req, res) {
        console.log(req.body);
        User.findOne({shortid: req.params.id}, function (err, user) {
            if (err) {
                res.json({success: false, message: "Error finding user " + err.message});
            } else {
                if (user) {
                    Profile.findOne({user: user}, function (err, profile) {
                        if (err) {
                            res.json({success: false, message: "Error finding profile " + err.message});
                        } else {
                            if (profile) {
                                delete req.body.tid;
                                delete req.body.receiver;
                                profile.reviews.push(req.body);
                                profile.save(function (err) {
                                    if (err) {
                                        res.json({success: false, message: "Error saving profile " + err.message});
                                    } else {
                                        res.json({success: true});
                                    }
                                });
                            } else {
                                res.json({success: false, message: "Profile not found"});
                            }
                        }
                    })
                } else {
                    res.json({success: false, message: "User not found"});
                }
            }
        })
    });

};
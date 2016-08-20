module.exports = function (app) {
    var User = require('../../models/user');
    var multer = require('multer');
    var localStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    });
    var upload = multer({storage: localStorage});
    
    app.post('/api/user/avatar', upload.any(), function (req, res) {
        console.log('Multer', req.files, req.body);
        res.json({success: true});
    });

    app.post('/api/user/:id/reset', function (req, res) {
        console.log(req.body);
        User.findOne({_id: req.params.id}, function (err, user) {

            if (err) {
                res.status(500).json({success: false, err: err});
            } else {
                if(user) {
                    if (user.password == req.body.eP) {
                        if(req.body.nP == req.body.rNP) {
                            user.password = req.body.nP;
                            user.resetPassword = false;
                            user.save(function(err, user){
                                if(err){
                                    res.json({success: false, reason: err.message})
                                }else{
                                    res.json({success: true});
                                }
                            });
                        }else{
                            res.json({success: false, reason: "New Password does not match Repeat New Password"})
                        }
                    } else {
                        res.json({success: false, reason: "Password does not match"})
                    }
                }else {
                    res.json({success: false, reason: "No matching user found"})
                }
            }
        });
    });

};

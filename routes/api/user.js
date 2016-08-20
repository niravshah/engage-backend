module.exports = function (app) {
    var env = process.env.NODE_ENV || 'dev';
    var config = require('./../../config')[env];
    var User = require('../../models/user');
    var multer = require('multer');
    var multerS3 = require('multer-s3');
    var aws = require('aws-sdk');
    var s3 = new aws.S3({signatureVersion: 'v4'});


    var localStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    });

    var s3Sotrage = multerS3({
        s3: s3,
        bucket: 'engage-site-nns',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    if (config.fileStorage == 's3') {
        var upload = multer({storage: s3Sotrage});
    } else {
        var upload = multer({storage: localStorage});
    }


    var getSavedFilePath = function (req, index) {
        if (config.fileStorage == 's3') {
            return req.files[index].location;
        } else {
            return '/' + req.files[index].path;
        }
    };


    app.post('/api/user/avatar', upload.any(), function (req, res) {
        console.log('Multer', req.files, req.body);

        User.findOne({_id:req.body.addData},function(err,user){
            if(err){
                res.json({success:false,reason:"Unexpected Error." + err.message});
            }else{
                if(user){
                    user.profileSet = true;
                    var av = getSavedFilePath(req,0);
                    user.avatar = av;
                    user.save(function(err){
                        if(err){
                            res.json({success:false,reason:"Error saving User." + err.message});
                        }else{
                            res.json({success:true,avatar:av,nextUrl:'/project/' + user.memberships[0].split("-")[1]});
                        }
                    })
                }else{
                    res.json({success:false,reason:"User Not Found."});
                }
            }
        });
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

module.exports = function(app,bcrypt,firebase) {

    var jwt = require('jsonwebtoken');
    var User = require('../../models/user');

    app.post('/api/authenticate', function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Unexpected Error' + err.message
                });
            }
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                bcrypt.compare(req.body.password,user.password,function(err,result){

                    if(err){
                        res.json({
                            success: false,
                            message: 'Authentication failed. Unable to decrypt.'
                        });

                    }else{

                        if(result == true){
                            var firebaseToken = firebase.auth().createCustomToken(user._id.toString(), {
                                roles: user.roles,
                                memberships: user.memberships.toString()
                            });
                            delete user.password;
                            var token = jwt.sign(user, 'secret_sauce', {expiresIn: "4h"});
                            res.cookie('jwt', token, {httpOnly: true});
                            res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token,
                                firebaseToken: firebaseToken,
                                tenant: req.body.tid
                            });

                        }else{
                            res.json({
                                success: false,
                                message: 'Authentication failed. Wrong password.'
                            });

                        }

                    }



                });

            }
        });
    });

};

var uname = require('./unamepwd');
var jwt = require('./jwt');
var User = require('../../models/user');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            //console.log('deserializing user:',user);
            done(err, user);
        });
    });

    uname(passport);
    jwt(passport);
};
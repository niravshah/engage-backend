var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, function(username, password, done) {
        console.log("Passport Login 1:", username, password, done);
        User.findOne({
            'email': username
        }, function(err, user) {
            if(err) return done(err);
            if(!user) {
                console.log('User not found with username ' + username);
                return done(null, false);
            }
            if(password != user.password) {
                console.log('Invalid Password');
                return done(null, false);
            }
            return done(null, user);
        });
    }));
}
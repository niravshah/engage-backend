var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../../models/user');
var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies.jwt;
    }
    return token;
};

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = "secret_sauce";
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({_id: jwt_payload._doc._id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
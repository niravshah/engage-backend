module.exports = function (app,passport) {
    
    /*app.get('/index', function (req, res) {
     res.render('index');
     });*/

    app.get('/home', passport.authenticate('jwt', {failureRedirect: '/login'}), function (req, res) {
        res.render('home', {sid: req.user.shortid});
    });
};

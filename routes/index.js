var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');

router.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'secret_sauce', function(err, decoded) {      
      if (err) {     
          res.redirect('/');
      } else {
        req.decoded = decoded;    
        next();
      }
    });
  } else {
      res.redirect('/');
  }
});

router.get('/index', function(req, res, next) {
    res.render('index');
});

router.get('/project/:id', function(req, res, next) {
    res.render('project',{pid:req.params.id});
});

router.get('/users', function (req, res, next) {
        User.find(function (err, users) {
            if (err){
                console.log('Callback Function', err);
                next(err);
            }
            else{
                res.json(users);
            }
        });
    });
module.exports = router;
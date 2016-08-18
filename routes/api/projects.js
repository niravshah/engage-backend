var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/projects/:id/members', function (req, res, next) {
    var membershipId = req.body.tid + "-" + req.params.id;
    User.find({memberships:membershipId, tid: req.body.tid},'firstName lastName email avatar badges',function(err,users){
        if(err){
            res.status(500).json({success:false,err:err});
        }else{
            res.json({success:true,users:users})
        }
    });
});

module.exports = router;
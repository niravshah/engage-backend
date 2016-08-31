module.exports = function(app) {

    var Profile = require('../../models/userprofile');

    app.get('/api/user/:id/profile', function (req, res) {
        Profile.findOne({user:req.params.id},function(err,profile){
            if(err){
                res.json({success:false, message:err.message});
            }else{
                if(profile){
                    res.json({success:true, profile:profile});
                }else {
                    res.json({success:false, message:"Could not find a profile for this user"});
                }
            }
        });

    });

    app.post('/api/user/:id/profile', function (req, res) {
        console.log(req.body);
        Profile.findOneAndUpdate({user:req.params.id},req.body.data,{upsert:true},function(err,profile){
            if(err){
                res.json({success:false, message:err.message});
            }else{
                if(profile){
                    res.json({success:true, profile:profile});
                }else {
                    res.json({success:false, message:"Created new profile for the user"});
                }
            }
        });

    });

};
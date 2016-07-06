var express = require('express');
var router = express.Router();
var project = require('../schemas/project.json')

router.get('/forms/project',function(req,res){
    res.render('modelform',{title:"Project", jsonUrl:"/add/project/json",postUrl:"/restify/api/v1/Project"});
});

router.get('/forms/project/json',function(req,resp){
    resp.json(project);
})

module.exports = router;
var restify = require('express-restify-mongoose');
var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var User = require('../models/user');
var Profile = require('../models/userprofile');

restify.serve(router, Project);
restify.serve(router, User);
restify.serve(router, Profile);

module.exports = router;
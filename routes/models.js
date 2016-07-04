var restify = require('express-restify-mongoose');
var express = require('express');
var router = express.Router();
var Project = require('../models/project');

restify.serve(router, Project);

module.exports = router;
var mongoose = require('mongoose');
var schema = require('../schemas/project.json')
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var projectSchema = new Schema(schema);
module.exports = mongoose.model('Project', projectSchema);    
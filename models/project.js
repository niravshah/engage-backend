var mongoose = require('mongoose');
var schema = require('../schemas/project.json');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
        "name": {
            "title": "Name",
            "type": "string",
            "required":true
        },
        "description": {
            "title":"Description",
            "type": "string"
        }
    }
);
module.exports = mongoose.model('Project', projectSchema);    
var mongoose = require('mongoose');
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
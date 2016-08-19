var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
        "name": {"type": "string", "required": true},
        "description": {"type": "string"}
    }
);
module.exports = mongoose.model('Project', projectSchema);    
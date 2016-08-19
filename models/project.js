var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
        "sid": {"type": "string", "required": true},
        "name": {"type": "string", "required": true},
        "description": {"type": "string"},
        "sDate": {"type": "Date"},
        "eDate": {"type": "Date"},
        "aboutOrg":{"type": "string"},
        "orgContact":{"type": "string"},
        "otherResources":{"type": "string"},
        "logo":{"type": "string"}
    }
);
module.exports = mongoose.model('Project', projectSchema);    
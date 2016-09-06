var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var projectSchema = new Schema({
        sid: {type: String, required: true},
        name: {type: String, required: true},
        description: {type: String},
        sDate: {type: Date},
        eDate: {type: Date},
        aboutOrg: {type: String},
        orgContact: {type: String},
        otherResources: {type: String},
        logo: {type: String},
        skillsDesired:[{type:ObjectId,ref:'Misc'}]
    }
);
module.exports = mongoose.model('Project', projectSchema);    
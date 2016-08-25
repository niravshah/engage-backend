var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
        sid: {type: "String", required: true},
        name: {type: "String", required: true},
        description: {type: "String"},
        sDate: {type: "Date"},
        eDate: {type: "Date"},
        aboutOrg: {type: "String"},
        orgContact: {type: "String"},
        otherResources: {type: "String"},
        logo: {type: "String"}
    }
);
module.exports = mongoose.model('Project', projectSchema);    
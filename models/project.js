var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    tid:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Project', projectSchema);    
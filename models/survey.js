var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var surveySchema = new Schema({
        sid: {type: String, required: true},
        from: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
        to: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
        project: {type: mongoose.Schema.ObjectId, ref: 'Project', required: true},
        survey: {type: Object, required: true}
    }
);
module.exports = mongoose.model('Survey', surveySchema);
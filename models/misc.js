var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var miscSchema = new Schema({
        sid: {type: String, required: true},
        name: {type: String, required: true},
        description: {type: String},
        type: {
            type: String,
            enum: ['skill', 'badge'],
            required: true
        },
        url: {type: String}
    }
);
module.exports = mongoose.model('Misc', miscSchema);    
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userProfileSchema = new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'Profile', required:true},
    primarySkills: {type: Array, default: []},
    desiredSkills:{type: Array, default: []},
    about: String,
    currentTitle: String,
    currentDepartment: String,
    currentTeam: String
});

module.exports = mongoose.model('Profile', userProfileSchema);
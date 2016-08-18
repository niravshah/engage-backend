var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    firstName: {type: String,required: true},
    lastName: {type: String,required: true},
    email: {type: String,required: true},
    password: {type: String,required: true},
    avatar: {type: String,required: true},
    userRoles: {type: Array, default: ['USER']},
    memberships: {type: Array, default: []},
    projectRoles:{type:Array, default:[]},
    badges:{type:Array, default:[]}
});

module.exports = mongoose.model('User', userSchema);    
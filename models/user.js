var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    shortid: {type: String,required: true},
    firstName: {type: String,required: true},
    lastName: {type: String,required: true},
    email: {type: String,required: true},
    password: {type: String,required: true},
    avatar: {type: String,required: true},
    title: {type: String},
    userRoles: {type: Array, default: ['USER']},
    memberships: {type: Array, default: []},
    projectRoles:{type:Schema.Types.Mixed},
    badges:{type:Array, default:[]},
    profileSet: {type:Boolean, default:false},
    profile:{type: mongoose.Schema.ObjectId, ref: 'Profile'},
    resetPassword: {type:Boolean, default:true},
    aboutMe:{type:String}
});

module.exports = mongoose.model('User', userSchema);    
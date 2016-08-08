var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    roles:
        { type : Array , default : ['USER'] }
    
});

module.exports = mongoose.model('User', userSchema);    
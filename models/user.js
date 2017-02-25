var mongoose = require('mongoose');
var db = mongoose.connection;

//User Schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser) {


};